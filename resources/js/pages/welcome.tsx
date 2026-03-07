import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { useState, useEffect } from 'react';

interface LandingSection {
    id: number;
    section: string;
    content: any;
    is_active: boolean;
}

interface Props {
    canRegister?: boolean;
    landingData: {
        hero?: LandingSection;
        features?: LandingSection;
        about?: LandingSection;
    };
}

export default function Welcome({ canRegister = true, landingData }: Props) {
    const { auth } = usePage().props;
    const [sticky, setSticky] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);

    const hero = landingData?.hero?.content;
    const features = landingData?.features?.content;
    const about = landingData?.about?.content;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= 80) {
                setSticky(true);
            } else {
                setSticky(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            
            <div className="min-h-screen bg-[#FCFCFC] dark:bg-black">
                {/* Header */}
                <header
                    className={`fixed top-0 left-0 right-0 z-40 flex w-full items-center transition-all ${
                        sticky
                            ? 'bg-white/80 backdrop-blur-sm shadow-md dark:bg-gray-900/80'
                            : 'bg-transparent'
                    }`}
                >
                    <div className="container mx-auto">
                        <div className="relative flex items-center justify-between px-4">
                            <div className="w-60 max-w-full xl:mr-12">
                                <Link
                                    href="/"
                                    className={`block w-full ${
                                        sticky ? 'py-5 lg:py-2' : 'py-8'
                                    }`}
                                >
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        IoT Platform
                                    </span>
                                </Link>
                            </div>
                            <div className="flex w-full items-center justify-between px-4">
                                <button
                                    onClick={() => setNavbarOpen(!navbarOpen)}
                                    className="absolute top-1/2 right-4 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-blue-600 focus:ring-2 lg:hidden"
                                >
                                    <span
                                        className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                                            navbarOpen ? 'top-[7px] rotate-45' : ''
                                        }`}
                                    />
                                    <span
                                        className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                                            navbarOpen ? 'opacity-0' : ''
                                        }`}
                                    />
                                    <span
                                        className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                                            navbarOpen ? 'top-[-8px] -rotate-45' : ''
                                        }`}
                                    />
                                </button>
                                <nav
                                    className={`absolute right-0 z-30 w-[250px] rounded border border-gray-200 bg-white px-6 py-4 duration-300 dark:border-gray-700 dark:bg-gray-900 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                                        navbarOpen
                                            ? 'visible top-full opacity-100'
                                            : 'invisible top-[120%] opacity-0'
                                    }`}
                                >
                                    <ul className="block lg:flex lg:space-x-12">
                                        <li>
                                            <a
                                                href="#home"
                                                className="flex py-2 text-base text-gray-700 hover:text-blue-600 lg:inline-flex lg:px-0 lg:py-6 dark:text-gray-300 dark:hover:text-blue-400"
                                            >
                                                Home
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#features"
                                                className="flex py-2 text-base text-gray-700 hover:text-blue-600 lg:inline-flex lg:px-0 lg:py-6 dark:text-gray-300 dark:hover:text-blue-400"
                                            >
                                                Features
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#about"
                                                className="flex py-2 text-base text-gray-700 hover:text-blue-600 lg:inline-flex lg:px-0 lg:py-6 dark:text-gray-300 dark:hover:text-blue-400"
                                            >
                                                About
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                                <div className="flex items-center justify-end pr-16 lg:pr-0">
                                    {auth.user ? (
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href="/dashboard/monitoring"
                                                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white transition duration-300 hover:bg-blue-700"
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/memberarea"
                                                className="rounded-md border-2 border-blue-600 px-6 py-3 text-base font-medium text-blue-600 transition duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                Member Area
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            <Link
                                                href={login()}
                                                className="hidden px-7 py-3 text-base font-medium text-gray-700 hover:opacity-70 md:block dark:text-white"
                                            >
                                                Sign In
                                            </Link>
                                            {canRegister && (
                                                <Link
                                                    href={register()}
                                                    className="hidden rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-blue-700 md:block"
                                                >
                                                    Sign Up
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section
                    id="home"
                    className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-900 md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
                >
                    <div className="container mx-auto">
                        <div className="flex flex-wrap px-4">
                            <div className="w-full">
                                <div className="mx-auto max-w-[800px] text-center">
                                    <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                                        {hero?.title || 'Smart IoT Monitoring Platform'}
                                    </h1>
                                    <p className="mb-12 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl">
                                        {hero?.subtitle || 'Monitor and control your IoT devices with real-time data analytics and intelligent automation. Built with Next.js and Tailwind CSS.'}
                                    </p>
                                    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                        <Link
                                            href={hero?.primary_button_url || register()}
                                            className="rounded-md bg-blue-600 px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-blue-700"
                                        >
                                            {hero?.primary_button_text || '🚀 Get Started'}
                                        </Link>
                                        <a
                                            href="#features"
                                            className="inline-block rounded-md bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
                                        >
                                            {hero?.secondary_button_text || 'Learn More'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Background SVG Decorations */}
                    <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
                        <svg
                            width="450"
                            height="556"
                            viewBox="0 0 450 556"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25:217)" />
                            <circle cx="17.9997" cy="182" r="18" fill="url(#paint1_radial_25:217)" />
                            <circle cx="76.9997" cy="288" r="34" fill="url(#paint2_radial_25:217)" />
                            <circle
                                cx="325.486"
                                cy="302.87"
                                r="180"
                                transform="rotate(-37.6852 325.486 302.87)"
                                fill="url(#paint3_linear_25:217)"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear_25:217"
                                    x1="-54.5003"
                                    y1="-178"
                                    x2="222"
                                    y2="288"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#3B82F6" />
                                    <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                                </linearGradient>
                                <radialGradient
                                    id="paint1_radial_25:217"
                                    cx="0"
                                    cy="0"
                                    r="1"
                                    gradientUnits="userSpaceOnUse"
                                    gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
                                >
                                    <stop offset="0.145833" stopColor="#3B82F6" stopOpacity="0" />
                                    <stop offset="1" stopColor="#3B82F6" stopOpacity="0.08" />
                                </radialGradient>
                                <radialGradient
                                    id="paint2_radial_25:217"
                                    cx="0"
                                    cy="0"
                                    r="1"
                                    gradientUnits="userSpaceOnUse"
                                    gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
                                >
                                    <stop offset="0.145833" stopColor="#3B82F6" stopOpacity="0" />
                                    <stop offset="1" stopColor="#3B82F6" stopOpacity="0.08" />
                                </radialGradient>
                                <linearGradient
                                    id="paint3_linear_25:217"
                                    x1="226.775"
                                    y1="-66.1548"
                                    x2="292.157"
                                    y2="351.421"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#3B82F6" />
                                    <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
                        <svg
                            width="364"
                            height="201"
                            viewBox="0 0 364 201"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
                                stroke="url(#paint0_linear_25:218)"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear_25:218"
                                    x1="184.389"
                                    y1="69.2405"
                                    x2="184.389"
                                    y2="212.24"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#3B82F6" stopOpacity="0" />
                                    <stop offset="1" stopColor="#3B82F6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-16 bg-white dark:bg-gray-900 md:py-20 lg:py-28">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto mb-12 max-w-[570px] text-center lg:mb-20">
                            <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
                                {features?.title || 'Main Features'}
                            </h2>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                {features?.subtitle || 'Powerful features to help you monitor and control your IoT devices efficiently'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                            {(features?.items || [
                                {
                                    icon: 'monitor',
                                    title: 'Real-time Monitoring',
                                    description: 'Monitor your IoT devices in real-time with live data updates and instant notifications.'
                                },
                                {
                                    icon: 'automation',
                                    title: 'Smart Automation',
                                    description: 'Automate your devices with intelligent rules and schedules for maximum efficiency.'
                                },
                                {
                                    icon: 'analytics',
                                    title: 'Data Analytics',
                                    description: 'Analyze your device data with powerful analytics tools and visualizations.'
                                },
                                {
                                    icon: 'security',
                                    title: 'Secure & Reliable',
                                    description: 'Enterprise-grade security with end-to-end encryption and reliable uptime.'
                                },
                                {
                                    icon: 'api',
                                    title: 'RESTful API',
                                    description: 'Integrate with your existing systems using our comprehensive REST API.'
                                },
                                {
                                    icon: 'support',
                                    title: '24/7 Support',
                                    description: 'Get help whenever you need it with our dedicated support team.'
                                }
                            ]).map((feature: any, index: number) => (
                                <div key={index} className="w-full">
                                    <div className="relative z-10 mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-blue-600">
                                        <span className="text-3xl">
                                            {feature.icon === 'monitor' && '📊'}
                                            {feature.icon === 'automation' && '⚙️'}
                                            {feature.icon === 'analytics' && '📈'}
                                            {feature.icon === 'security' && '🔒'}
                                            {feature.icon === 'api' && '🔌'}
                                            {feature.icon === 'support' && '💬'}
                                        </span>
                                    </div>
                                    <h3 className="mb-5 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                                        {feature.title}
                                    </h3>
                                    <p className="pr-[10px] text-base font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About/Stats Section */}
                {about && (
                    <section id="about" className="py-16 bg-gray-50 dark:bg-gray-800 md:py-20 lg:py-28">
                        <div className="container mx-auto px-4">
                            <div className="mx-auto max-w-4xl text-center">
                                <h2 className="mb-6 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
                                    {about.title}
                                </h2>
                                <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
                                    {about.description}
                                </p>
                                {about.stats && (
                                    <div className="grid gap-8 md:grid-cols-3">
                                        {about.stats.map((stat: any, index: number) => (
                                            <div key={index} className="text-center">
                                                <div className="mb-2 text-4xl font-bold text-blue-600">
                                                    {stat.value}
                                                </div>
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="relative z-10 bg-white pt-16 dark:bg-gray-900 md:pt-20 lg:pt-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap">
                            <div className="mb-12 w-full px-4 md:w-1/2 lg:mb-16 lg:w-5/12">
                                <Link href="/" className="mb-8 inline-block">
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        IoT Platform
                                    </span>
                                </Link>
                                <p className="mb-9 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                                    Transform your home and business with intelligent IoT solutions. Monitor, control, and automate your devices from anywhere.
                                </p>
                            </div>

                            <div className="mb-12 w-full px-4 sm:w-1/2 md:w-1/2 lg:mb-16 lg:w-2/12">
                                <h3 className="mb-10 text-xl font-bold text-black dark:text-white">
                                    Quick Links
                                </h3>
                                <ul>
                                    <li>
                                        <a
                                            href="#features"
                                            className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                        >
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#about"
                                            className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                        >
                                            About
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-12 w-full px-4 md:w-1/2 lg:mb-16 lg:w-3/12">
                                <h3 className="mb-10 text-xl font-bold text-black dark:text-white">
                                    Support
                                </h3>
                                <ul>
                                    <li>
                                        <Link
                                            href={login()}
                                            className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                        >
                                            Sign In
                                        </Link>
                                    </li>
                                    {canRegister && (
                                        <li>
                                            <Link
                                                href={register()}
                                                className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                            >
                                                Sign Up
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
                        <div className="py-8">
                            <p className="text-center text-base text-gray-600 dark:text-gray-400">
                                © {new Date().getFullYear()} IoT Platform. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
