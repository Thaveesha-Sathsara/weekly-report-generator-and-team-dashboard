import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';
import { Users, UserPlus } from 'lucide-react';

import DataTable from '@/components/DataTable';
import { getMemberColumns } from './MemberColumns';
import ConfirmModal from '@/components/ConfirmModal';
import { Button } from '@/components/ui/button';

const Members = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [approvalData, setApprovalData] = useState(null); 

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('/auth/users');
            setUsers(res.data);
        } catch (error) {
            toast.error("Failed to load user directory");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const activeUsers = users.filter(u => u.accountStatus !== 'Pending');
    const pendingUsers = users.filter(u => u.accountStatus === 'Pending');

    const handleApprovalRequest = (user, role) => {
        setApprovalData({ user, role });
    };

    const executeApproval = async () => {
        if (!approvalData) return;
        try {
            await axiosInstance.put(`/auth/approve/${approvalData.user._id}`, { 
                assignedRole: approvalData.role 
            });
            toast.success(`${approvalData.user.fullName} approved as ${approvalData.role}`);
            setApprovalData(null); 
            fetchUsers(); 
        } catch (error) {
            toast.error("Failed to approve user");
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">User Directory</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage system access and team roles.</p>
                </div>

                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
                    <Button 
                        variant={activeTab === 'pending' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('pending')}
                        className={`rounded-lg px-6 h-10 ${activeTab === 'pending' ? 'bg-white text-blue-600 shadow-sm hover:bg-white hover:text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <UserPlus className="w-4 h-4 mr-2" /> 
                        Pending Requests 
                        {pendingUsers.length > 0 && (
                            <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-bold">
                                {pendingUsers.length}
                            </span>
                        )}
                    </Button>
                    <Button 
                        variant={activeTab === 'active' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('active')}
                        className={`rounded-lg px-6 h-10 ${activeTab === 'active' ? 'bg-white text-blue-600 shadow-sm hover:bg-white hover:text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Users className="w-4 h-4 mr-2" /> 
                        Active Directory
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'pending' ? (
                    <DataTable 
                        key="pending-table" // forces re-render when switching
                        columns={getMemberColumns(handleApprovalRequest)} 
                        data={pendingUsers} 
                        title="Needs Approval"
                        isLoading={isLoading}
                    />
                ) : (
                    <DataTable 
                        key="active-table"
                        columns={getMemberColumns(handleApprovalRequest)} 
                        data={activeUsers} 
                        title="Active Members"
                        isLoading={isLoading}
                    />
                )}
            </div>

            <ConfirmModal 
                isOpen={!!approvalData} 
                onClose={() => setApprovalData(null)}
                onConfirm={executeApproval}
                title={`Approve as ${approvalData?.role}?`}
                description={`Are you sure you want to grant ${approvalData?.user?.fullName} access to the portal as a ${approvalData?.role}? They will be able to log in immediately.`}
                confirmText={`Approve ${approvalData?.role}`}
                variant="default"
            />
        </div>
    );
};

export default Members;