export const getCategoryBGGradient = () => {
  const gradients = [
    "bg-gradient-to-r from-purple-50 to-pink-50",
    "bg-gradient-to-r from-cyan-50 to-blue-50",
    "bg-gradient-to-r from-green-50 to-blue-50",
    "bg-gradient-to-r from-yellow-50 to-orange-50",
    "bg-gradient-to-r from-pink-50 to-rose-50",
    "bg-gradient-to-r from-violet-50 to-purple-50",
    "bg-gradient-to-r from-indigo-50 to-purple-50",
    "bg-gradient-to-r from-emerald-50 to-teal-50",
    "bg-gradient-to-r from-orange-50 to-red-50",
    "bg-gradient-to-r from-blue-50 to-indigo-50",
    "bg-gradient-to-tr from-blue-50 to-purple-50",
    "bg-gradient-to-tr from-rose-50 to-indigo-50",
    "bg-gradient-to-tr from-teal-50 to-blue-50",
    "bg-gradient-to-tr from-amber-50 to-pink-50",
    "bg-gradient-to-tr from-emerald-50 to-cyan-50",
  ];

  // Simply return a random gradient
  return gradients[Math.floor(Math.random() * gradients.length)];
};
