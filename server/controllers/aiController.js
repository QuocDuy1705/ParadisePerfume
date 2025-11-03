import {
  getAIRecommendations,
  getQuizQuestions,
} from "../services/aiRecommendation.service.js";
import Product from "../models/Product.js";

/**
 * AI Controller
 * Handle AI-powered recommendation requests
 */

// @route   POST /api/ai/recommend
// @desc    Get AI-powered product recommendations
// @access  Public
export const getRecommendations = async (req, res) => {
  try {
    console.log("🤖 AI Recommendation request received");
    console.log("📝 Preferences:", req.body.preferences);

    const { preferences } = req.body;

    // Validate input
    if (!preferences || typeof preferences !== "object") {
      console.log("❌ Invalid preferences");
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp thông tin preferences",
      });
    }

    // Get available products from database
    console.log("📦 Fetching products from database...");

    // First check total products
    const totalProducts = await Product.countDocuments();
    console.log(`📊 Total products in DB: ${totalProducts}`);

    // Try without filters first
    const allProducts = await Product.find({}).select(
      "name type category price description notes image detailUrl rating stock isActive"
    );

    console.log(`✅ Found ${allProducts.length} products (without filter)`);

    // Use all products for now (remove strict filters)
    const availableProducts = allProducts;

    if (availableProducts.length === 0) {
      console.log("❌ No products found");
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm nào",
      });
    }

    // Get AI recommendations
    console.log("🤖 Calling AI service...");
    const recommendations = await getAIRecommendations(
      preferences,
      availableProducts
    );
    console.log(
      "✅ AI service completed:",
      recommendations.success ? "SUCCESS" : "FALLBACK"
    );

    if (!recommendations.success && recommendations.error) {
      // Return fallback recommendations if AI fails
      return res.status(200).json({
        success: true,
        message: "Đã tạo gợi ý dựa trên tiêu chí của bạn (fallback mode)",
        data: {
          analysis:
            "Chúng tôi đã phân tích sở thích của bạn và tìm thấy những sản phẩm phù hợp nhất.",
          recommendations: recommendations.fallbackRecommendations,
          totalRecommendations: recommendations.fallbackRecommendations.length,
          mode: "fallback",
        },
      });
    }

    // Return AI recommendations
    res.status(200).json({
      success: true,
      message: "AI đã phân tích và tạo gợi ý cho bạn",
      data: {
        analysis: recommendations.analysis,
        recommendations: recommendations.recommendations,
        totalRecommendations: recommendations.totalRecommendations,
        generatedAt: recommendations.generatedAt,
        mode: "ai",
      },
    });
  } catch (error) {
    console.error("❌ ERROR in getRecommendations:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo gợi ý",
      error: error.message,
    });
  }
};

// @route   GET /api/ai/quiz
// @desc    Get quiz questions for preferences
// @access  Public
export const getQuiz = async (req, res) => {
  try {
    const questions = getQuizQuestions();

    res.status(200).json({
      success: true,
      message: "Quiz questions retrieved successfully",
      data: {
        questions,
        totalQuestions: questions.length,
        estimatedTime: "2-3 phút",
      },
    });
  } catch (error) {
    console.error("Error in getQuiz:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy câu hỏi quiz",
      error: error.message,
    });
  }
};

// @route   POST /api/ai/feedback
// @desc    Submit user feedback on recommendations
// @access  Public
export const submitFeedback = async (req, res) => {
  try {
    const { recommendationId, rating, comment, selectedProducts } = req.body;

    // TODO: Save feedback to database for improving AI
    // This helps train/improve the recommendation system over time

    res.status(200).json({
      success: true,
      message: "Cảm ơn phản hồi của bạn! Điều này giúp chúng tôi cải thiện AI.",
    });
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi gửi feedback",
      error: error.message,
    });
  }
};

export default {
  getRecommendations,
  getQuiz,
  submitFeedback,
};
