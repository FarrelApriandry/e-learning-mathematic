// src/components/ui/AuthCard.jsx
const AuthCard = ({ children }) => {
    return (
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm animate-slide-in-right">
        {children}
    </div>
    );
};

export default AuthCard;