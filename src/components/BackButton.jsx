import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="fixed top-6 left-6 bg-gray-800 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-gray-700 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out z-20 cursor-pointer transform active:scale-95 shadow-md"
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-[-2px]" />
      <span className="text-sm font-medium">BACK</span>
    </button>
  );
};

export default BackButton;
