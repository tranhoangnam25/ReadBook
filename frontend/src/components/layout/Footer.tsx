export default function Footer() {
    return (<footer className="mt-20 border-t border-primary/10 bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-primary dark:text-accent">
                        <span className="material-symbols-outlined text-2xl"
                            data-icon="auto_stories">auto_stories</span>
                        <h1 className="text-lg font-bold tracking-tight">Sunset Books</h1>
                    </div>
                    <p className="text-sm leading-relaxed text-primary/60">
                        Bringing the world's greatest stories to your digital doorstep. Experience the premium way
                        to read and collect ebooks.
                    </p>
                    <div className="flex gap-4">
                        <a className="text-primary/40 hover:text-accent transition-colors" href="#">
                            <span className="material-symbols-outlined" data-icon="public">public</span>
                        </a>
                        <a className="text-primary/40 hover:text-accent transition-colors" href="#">
                            <span className="material-symbols-outlined" data-icon="mail">mail</span>
                        </a>
                        <a className="text-primary/40 hover:text-accent transition-colors" href="#">
                            <span className="material-symbols-outlined" data-icon="share">share</span>
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="mb-6 font-bold text-primary">Company</h4>
                    <ul className="space-y-4 text-sm text-primary/60">
                        <li><a className="hover:text-accent" href="#">About Us</a></li>
                        <li><a className="hover:text-accent" href="#">Careers</a></li>
                        <li><a className="hover:text-accent" href="#">Press</a></li>
                        <li><a className="hover:text-accent" href="#">Authors</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-6 font-bold text-primary">Support</h4>
                    <ul className="space-y-4 text-sm text-primary/60">
                        <li><a className="hover:text-accent" href="#">Help Center</a></li>
                        <li><a className="hover:text-accent" href="#">Contact Support</a></li>
                        <li><a className="hover:text-accent" href="#">Device Compatibility</a></li>
                        <li><a className="hover:text-accent" href="#">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-6 font-bold text-primary">Stay Inspired</h4>
                    <p className="mb-4 text-sm text-primary/60">Get weekly book recommendations and reading tips.</p>
                    <div className="flex gap-2">
                        <input
                            className="w-full rounded-lg border-primary/10 bg-primary/5 px-4 py-2 text-sm focus:border-accent focus:ring-accent"
                            placeholder="Your email" type="email" />
                        <button
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90">Join</button>
                    </div>
                </div>
            </div>
            <div className="mt-16 border-t border-primary/5 pt-8 text-center text-xs text-primary/40">
                © 2024 Sunset Books. All rights reserved. Designed for the modern reader.
            </div>
        </div>
    </footer>)
}