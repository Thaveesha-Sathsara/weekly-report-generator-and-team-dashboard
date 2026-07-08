import { useContext } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { LayoutDashboard, FileText, FolderKanban, Lougout } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
    const { currentUser, isLoading, logout } = useContext(AuthContext);

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!currentUser) return <Navigate to="/login" replace />;

    return (
        <div className="flex h-screen bg-blue-50 text-blue-900">

            {/* sidebar */}
            <aside className="w-64 border-r border-blue-200 bg-white flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-blue-200">
                    <span className="font-bold text-xl text-blue-600">Sinesco</span>
                    <span className="font-semibold text-sl ml-1">Portal</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {/* see their own reports */}
                    <Link to="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-base">
                            <FileText className="h-5 w-5" />
                            My Reports
                        </Button>
                    </Link>

                    {/* manager only team dashboard and projects */}
                    {currentUser.role === 'Manager' && (
                        <>
                            <Link to="/team">
                                <Button variant="ghost" className="w-full justify-start gap-3 text-base">
                                    <LayoutDashboard className="h-5 w-5" />
                                    Team Dashboard
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-blue-200">
                    
                </div>
            </aside>
        </div>
    )
}