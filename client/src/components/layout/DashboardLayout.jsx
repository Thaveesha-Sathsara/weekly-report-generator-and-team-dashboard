import { useContext } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { LayoutDashboard, FileText, LogOut, FolderKanban, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
    const { currentUser, isLoading, logout } = useContext(AuthContext);
    const location = useLocation();

    if (isLoading) return <div className="flex h-screen items-center justify-center bg-slate-50">Loading...</div>;
    if (!currentUser) return <Navigate to="/login" replace />;

    // Helper for active link styles
    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900">
            {/* Sidebar - Refined with subtle border and professional spacing */}
            <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shadow-sm z-10">
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                        Sinesco<span className="text-blue-600">.</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1">
                    <Link to="/my-reports">
                        <Button variant={isActive('/my-reports') ? "secondary" : "ghost"} className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium">
                            <FileText className="h-5 w-5" />
                            My Reports
                        </Button>
                    </Link>

                    {currentUser.role === 'Manager' && (
                        <>
                            <div className="pt-6 pb-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Management</div>
                            <Link to="/team">
                                <Button variant={isActive('/team') ? "secondary" : "ghost"} className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium">
                                    <LayoutDashboard className="h-5 w-5" />
                                    Team Dashboard
                                </Button>
                            </Link>
                            <Link to="/projects">
                                <Button variant={isActive('/projects') ? "secondary" : "ghost"} className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium">
                                    <FolderKanban className="h-5 w-5" />
                                    Manage Projects
                                </Button>
                            </Link>
                            <Link to="/members">
                                <Button variant={isActive('/members') ? "secondary" : "ghost"} className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium">
                                    <Users className="h-5 w-5" />
                                    User Directory
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
                            {currentUser.fullName.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-slate-900">{currentUser.fullName}</p>
                            <p className="text-xs text-slate-500 truncate font-medium">{currentUser.role}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full gap-2 h-10 rounded-xl border-slate-200 font-semibold text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors" onClick={logout}>
                        <LogOut className="h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content - Modern "Floating" Content Feel */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 capitalize">
                        {location.pathname.replace('/', '').replace('-', ' ')}
                    </h2>
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-900">
                        <Settings className="h-5 w-5" />
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;