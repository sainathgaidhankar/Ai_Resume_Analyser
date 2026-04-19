import Navbar from "~/components/Navbar";
import UploadForm from "~/components/UploadForm";

const Upload = () => {
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <UploadForm />
            </section>
        </main>
    )
}

export default Upload
