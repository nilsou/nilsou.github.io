document.addEventListener('DOMContentLoaded', () => {
    const playbackThreshold = 0.6;
    const videos = document.querySelectorAll('.video');

    const prepareVideo = video => {
        if (video.preload === 'auto') {
            return;
        }

        video.preload = 'auto';
        video.load();
    };

    const preloadObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            prepareVideo(entry.target);
            preloadObserver.unobserve(entry.target);
        });
    }, { rootMargin: '75% 0px' });

    const playbackObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.intersectionRatio >= playbackThreshold) {
                prepareVideo(video);
                video.play().catch(() => {});
                return;
            }

            video.pause();
            video.currentTime = 0;
        });
    }, { threshold: playbackThreshold });

    videos.forEach(video => {
        preloadObserver.observe(video);
        playbackObserver.observe(video);
    });
});
