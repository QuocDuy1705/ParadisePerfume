import { useState } from "react";

const FilterPanel = ({ onFilter }) => {
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const applyFilter = (e) => {
    e.preventDefault();
    onFilter({ brand, gender, min, max });
  };

  return (
    <form
      onSubmit={applyFilter}
      className="flex flex-col md:flex-row gap-4 mb-4"
    >
      <input
        type="text"
        placeholder="Thương hiệu"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="border p-2 rounded"
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Giới tính</option>
        <option value="male">Nam</option>
        <option value="female">Nữ</option>
        <option value="unisex">Unisex</option>
      </select>
      <input
        type="number"
        placeholder="Giá từ"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className="border p-2 rounded w-24"
      />
      <input
        type="number"
        placeholder="đến"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className="border p-2 rounded w-24"
      />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Lọc
      </button>
    </form>
  );
};

export default FilterPanel;
