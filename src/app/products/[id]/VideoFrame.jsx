export default function VideoFrame({ url }) {
    let videoId = "";

    if (url.includes("shorts/")) {
        // Shorts URL
        videoId = url.split("shorts/")[1].split("?")[0];
    } else if (url.includes("youtu.be")) {
        // youtu.be short URL
        videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
        // normal watch URL
        videoId = url.split("v=")[1].split("&")[0];
    }

    return (
        <div className="w-full aspect-video mt-5">
            <h2 className="text-xl font-bold text-gray-900 mb-3"> Video</h2>
            <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}
