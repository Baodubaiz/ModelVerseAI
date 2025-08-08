"use client";
import { Brain, Facebook, Twitter, Linkedin, Github, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export function Footer() {
    const productLinks = [
        { label: "Mô hình AI", href: "#models" },
        { label: "Playground", href: "#playground" },
        { label: "API Service", href: "#api" },
        { label: "Enterprise", href: "#enterprise" },
        { label: "Training Hub", href: "#training" },
    ];

    const supportLinks = [
        { label: "Tài liệu", href: "#docs" },
        { label: "Hướng dẫn", href: "#guides" },
        { label: "Community", href: "#community" },
        { label: "Liên hệ", href: "#contact" },
        { label: "Bug Report", href: "#bug-report" },
    ];

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Github, href: "#", label: "GitHub" },
    ];

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription
        console.log("Newsletter subscription submitted");
    };

    return (
        <footer className="bg-gradient-to-t from-slate-950 to-transparent py-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-green-500 rounded-lg flex items-center justify-center">
                                <Brain className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl gradient-text">AI MarketPlace</span>
                        </div>
                        <p className="text-gray-300 mb-6 text-sm">
                            Nền tảng giao dịch mô hình AI hàng đầu Việt Nam, kết nối các nhà phát triển và người dùng trong cộng đồng AI.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-purple-500/20 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Sản phẩm</h4>
                        <ul className="space-y-3">
                            {productLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Hỗ trợ</h4>
                        <ul className="space-y-3">
                            {supportLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Nhận thông báo</h4>
                        <p className="text-gray-300 mb-4 text-sm">Cập nhật những mô hình AI mới nhất</p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                            <Input
                                type="email"
                                placeholder="email@example.com"
                                className="bg-slate-800 border-gray-600 focus:border-purple-500"
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-500 to-green-500 hover:shadow-lg transition-all"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Đăng ký
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-400 text-sm mb-4 md:mb-0">
                        © 2024 AI MarketPlace. Tất cả quyền được bảo lưu.
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-400">
                        <a href="#terms" className="hover:text-purple-400 transition-colors">
                            Điều khoản
                        </a>
                        <a href="#privacy" className="hover:text-purple-400 transition-colors">
                            Bảo mật
                        </a>
                        <a href="#cookies" className="hover:text-purple-400 transition-colors">
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;