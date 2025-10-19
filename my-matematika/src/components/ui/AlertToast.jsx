// src/components/ui/AlertToast.jsx
const IconCheck = ({className=""}) => (
    <svg class={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);
const IconError = ({className=""}) => (
    <svg class={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 9v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="0" fill="currentColor" opacity="0.06"/>
    </svg>
);

const AlertToast = ({ type = "success", message = "" }) => {
    const bg = type === "success" ? "bg-green-500" : "bg-red-500";
    return (
    <div class={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white z-[9999] ${bg} animate-toast-in`}>
        {type === "success" ? <IconCheck className="w-5 h-5" /> : <IconError className="w-5 h-5" />}
        <span class="font-medium">{message}</span>
    </div>
    );
};

export default AlertToast;
