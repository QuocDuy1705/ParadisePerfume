import OpenAI from "openai";

// Lazy initialization - only create client when needed
let openai = null;

const getOpenAIClient = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

/**
 * AI Recommendation Service
 * Gợi ý nước hoa dựa trên preferences của user
 */

export const getAIRecommendations = async (
  userPreferences,
  availableProducts
) => {
  try {
    // Build prompt with user preferences and product data
    const prompt = `
Bạn là chuyên gia tư vấn nước hoa của Paradise Perfume.

THÔNG TIN KHÁCH HÀNG:
- Giới tính: ${userPreferences.gender || "Không xác định"}
- Độ tuổi: ${userPreferences.age || "Không xác định"}
- Mùa hiện tại: ${userPreferences.season || "Không xác định"}
- Dịp sử dụng: ${userPreferences.occasion || "Hàng ngày"}
- Phong cách yêu thích: ${userPreferences.style || "Không xác định"}
- Ngân sách: ${userPreferences.budget || "Linh hoạt"}
- Sở thích hương: ${userPreferences.preferences?.join(", ") || "Chưa có"}

DANH SÁCH SẢN PHẨM CÓ SẴN:
${JSON.stringify(
  availableProducts.map((p) => ({
    id: p._id,
    name: p.name,
    type: p.type,
    category: p.category,
    price: p.price,
    description: p.description,
    notes: p.notes,
  })),
  null,
  2
)}

NHIỆM VỤ:
Dựa trên thông tin khách hàng, hãy phân tích và gợi ý 3 sản phẩm PHÙ HỢP NHẤT từ danh sách trên.

YÊU CẦU:
1. Phân tích tính cách/phong cách từ thông tin
2. Match với notes, type, category của sản phẩm
3. Xem xét ngân sách và dịp sử dụng
4. Giải thích LÝ DO cụ thể cho mỗi gợi ý
5. Score từ 0-100 (độ phù hợp)

OUTPUT FORMAT (STRICT JSON):
{
  "analysis": "Phân tích ngắn gọn về khách hàng (2-3 câu)",
  "recommendations": [
    {
      "productId": "id_sản_phẩm",
      "productName": "Tên sản phẩm",
      "score": 95,
      "reason": "Lý do cụ thể tại sao phù hợp (2-3 câu)",
      "bestFor": "Thời điểm/dịp tốt nhất để dùng",
      "tips": "Tips sử dụng để tối ưu hương"
    }
  ]
}

Chỉ trả về JSON, không có text khác.
`;

    // Get OpenAI client (lazy initialization)
    const client = getOpenAIClient();

    // If no API key, use fallback immediately
    if (!client) {
      console.log("⚠️  No OpenAI API key - using fallback recommendations");
      return {
        success: false,
        error: "OpenAI API key not configured",
        fallbackRecommendations: getFallbackRecommendations(
          userPreferences,
          availableProducts
        ),
      };
    }

    // Call OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Cheaper version, still good
      messages: [
        {
          role: "system",
          content:
            "You are a professional perfume consultant. Always respond in Vietnamese with valid JSON format only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }, // Force JSON response
    });

    // Parse response
    const aiResponse = JSON.parse(response.choices[0].message.content);

    // Validate and enrich with full product data
    const enrichedRecommendations = aiResponse.recommendations.map((rec) => {
      const product = availableProducts.find(
        (p) => p._id.toString() === rec.productId
      );
      return {
        ...rec,
        product: product
          ? {
              _id: product._id,
              name: product.name,
              type: product.type,
              category: product.category,
              price: product.price,
              image: product.image,
              detailUrl: product.detailUrl,
            }
          : null,
      };
    });

    return {
      success: true,
      analysis: aiResponse.analysis,
      recommendations: enrichedRecommendations,
      totalRecommendations: enrichedRecommendations.length,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error("AI Recommendation Error:", error);

    // Fallback to simple recommendation if AI fails
    return {
      success: false,
      error: error.message,
      fallbackRecommendations: getFallbackRecommendations(
        userPreferences,
        availableProducts
      ),
    };
  }
};

/**
 * Fallback recommendation logic (rule-based)
 * Sử dụng khi OpenAI không available
 */
const getFallbackRecommendations = (preferences, products) => {
  let filteredProducts = [...products];

  // Filter by gender
  if (preferences.gender === "Nam") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === "men" || p.type?.toLowerCase().includes("nam")
    );
  } else if (preferences.gender === "Nữ") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === "women" || p.type?.toLowerCase().includes("nữ")
    );
  }

  // Filter by budget
  if (preferences.budget) {
    const budgetNum = parseInt(preferences.budget.replace(/\D/g, ""));
    if (budgetNum) {
      filteredProducts = filteredProducts.filter((p) => p.price <= budgetNum);
    }
  }

  // Sort by rating/popularity (if available)
  filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // Take top 3
  const top3 = filteredProducts.slice(0, 3);

  return top3.map((product, index) => ({
    productId: product._id,
    productName: product.name,
    score: 80 - index * 10, // Simple scoring
    reason: "Sản phẩm phù hợp với tiêu chí của bạn",
    bestFor: "Sử dụng hàng ngày",
    tips: "Xịt vào điểm mạch để giữ hương lâu hơn",
    product: {
      _id: product._id,
      name: product.name,
      type: product.type,
      category: product.category,
      price: product.price,
      image: product.image,
      detailUrl: product.detailUrl,
    },
  }));
};

/**
 * Generate quiz questions for user preferences
 */
export const getQuizQuestions = () => {
  return [
    {
      id: "gender",
      question: "Bạn đang tìm nước hoa cho?",
      type: "single",
      options: ["Nam", "Nữ", "Unisex"],
    },
    {
      id: "age",
      question: "Độ tuổi của bạn?",
      type: "single",
      options: ["Dưới 20", "20-30", "30-40", "Trên 40"],
    },
    {
      id: "season",
      question: "Bạn muốn dùng vào mùa nào?",
      type: "single",
      options: ["Xuân", "Hè", "Thu", "Đông", "Cả năm"],
    },
    {
      id: "occasion",
      question: "Dịp sử dụng chủ yếu?",
      type: "single",
      options: ["Hàng ngày", "Đi làm", "Đi chơi/Hẹn hò", "Dạ tiệc", "Thể thao"],
    },
    {
      id: "style",
      question: "Phong cách của bạn?",
      type: "single",
      options: ["Thanh lịch", "Năng động", "Cá tính", "Lãng mạn", "Sang trọng"],
    },
    {
      id: "preferences",
      question: "Bạn thích hương gì? (Chọn nhiều)",
      type: "multiple",
      options: [
        "Hoa (Floral)",
        "Trái cây (Fruity)",
        "Gỗ (Woody)",
        "Xạ hương (Musk)",
        "Cam chanh (Citrus)",
        "Phương Đông (Oriental)",
        "Tươi mát (Fresh)",
        "Ngọt ngào (Sweet)",
      ],
    },
    {
      id: "budget",
      question: "Ngân sách dự kiến?",
      type: "single",
      options: [
        "Dưới 1 triệu",
        "1-3 triệu",
        "3-5 triệu",
        "Trên 5 triệu",
        "Không giới hạn",
      ],
    },
  ];
};

export default {
  getAIRecommendations,
  getQuizQuestions,
};
