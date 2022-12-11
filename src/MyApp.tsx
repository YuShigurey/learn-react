import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import ThreeScene from "./pages/Ob3"
// import Blogs from "./pages/Blogs";
// import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";

export default function App() {
    // return (
    //     <BrowserRouter>
    //         <Routes>
    //             <Route path="/" element={<Layout />}>
    //                 <Route index element={<Home />} />
    //                 <Route path="three" element={<ThreeScene />} />
    //                 {/*<Route path="blogs" element={<Blogs />} />*/}
    //                 {/*<Route path="contact" element={<Contact />} />*/}
    //                 <Route path="*" element={<NoPage />} />
    //             </Route>
    //         </Routes>
    //     </BrowserRouter>
    // );

    return (
        <>
            {/*<TreeWrapper tree={*/}
            {/*    {"HHH": { __levaInput: true, path: "HHH" }}*/}
            {/*} toggled={true} />*/}
        <ThreeScene />
        </>
    );
}

