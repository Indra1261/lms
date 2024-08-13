// "use client"

// import dynamic from "next/dynamic";
// import { useMemo } from "react";
// import "react-quill/dist/quill.bubble.css";  // Use the snow theme CSS

// interface PreviewProps {
//     value: string;
// }

// export const Preview = ({ value }: PreviewProps) => {
//     // Dynamically import ReactQuill component without SSR
//     const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

//     return (
//         <div >
//             <ReactQuill
//                 theme="bubble"   // Make sure this matches the CSS import
//                 value={value}
//                 readOnly
//                 // Optional: You can add other props here if needed
//             />
//         </div>
//     );
// };
