import React from 'react';

const Testimonials = () => {
    const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Briar Martin',
            handle: '@neilstellar',
            date: 'April 20, 2025',
            rating: 4,
            message: "Radiant completely transformed the way we manage clients. It's intuitive and powerful!"
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Avery Johnson',
            handle: '@averywrites',
            date: 'May 10, 2025',
            rating: 4,
            message: "I’ve used dozens of tools, but Radiant stands out in terms of performance and simplicity."
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Lee',
            handle: '@jordantalks',
            date: 'June 5, 2025',
            rating: 5,
            message: "The customer support is lightning-fast and actually helpful. Radiant is a game-changer!"
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Cameron Blake',
            handle: '@camcodes',
            date: 'July 1, 2025',
            rating: 4,
            message: "From onboarding to automation, Radiant helped streamline our entire workflow."
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white">
            <div className="flex gap-2">
                <img className="size-11 rounded-full" src={card.image} alt={`${card.name}'s profile`} />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <p className="font-semibold text-gray-900">{card.name}</p>
                        {/* 1. FIXED SVG PATH DATA */}
                        <svg className="mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.555 7.561C4.402 7.714 4.198 7.8 4 7.8C3.802 7.8 3.598 7.714 3.445 7.561L1.445 5.561C1.139 5.255 1.139 4.745 1.445 4.439C1.751 4.133 2.261 4.133 2.567 4.439L4 5.872L9.433 0.439C9.739 0.133 10.249 0.133 10.555 0.439C10.861 0.745 10.861 1.255 10.555 1.561L4.555 7.561Z" fill="#FB6D3A" transform="translate(0.5, 2)" />
                        </svg>
                    </div>
                    <span className="text-xs text-slate-500">{card.handle}</span>
                </div>
            </div>

            <div className="mt-2 text-yellow-500 text-sm">
                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < card.rating ? '★' : '☆'}</span>
                ))}
            </div>

            <p className="text-sm py-3 text-gray-800">{card.message}</p>

            <div className="flex items-center justify-between text-slate-500 text-xs">
                <div className="flex items-center gap-1">
                    <span>Posted on</span>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500" aria-label="View on X">
                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.027 0l4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z" fill="currentColor" />
                        </svg>
                    </a>
                </div>
                <p>{card.date}</p>
            </div>
        </div>
    );

    return (
        <div className="py-20 bg-white">
            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }

                .marquee-inner {
                    animation: marqueeScroll 25s linear infinite;
                }
                
                .marquee-inner:hover {
                    animation-play-state: paused;
                }

                .marquee-reverse {
                    animation-direction: reverse;
                }
            `}</style>

            <div className="text-center mb-12 px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    What Our Customers Say
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover how Radiant is helping businesses stay ahead of the competition with real feedback from our satisfied customers.
                </p>
            </div>

            <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {/* 2. FIXED KEY PROP */}
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={`${card.handle}-${index}`} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>

            <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative mt-4">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={`${card.handle}-${index}-reverse`} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>
        </div>
    );
};

export default Testimonials;
