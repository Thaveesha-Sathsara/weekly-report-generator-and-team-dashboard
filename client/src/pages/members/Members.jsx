import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'sonner';

import DataTable from '@/components/DataTable';
import { getMemberColumns } from './MemberColumns';
import ConfirmModal from '@/components/ConfirmModal';

const Members = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for the Approval Modal
    const [approvalData, setApprovalData] = useState(null); // { user: {}, role: 'Manager' | 'Team Member' }

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

    // triggered when a button in the table is clicked
    const handleApprovalRequest = (user, role) => {
        setApprovalData({ user, role });
    };

    // triggered when the confirmModal is accepted
    const executeApproval = async () => {
        if (!approvalData) return;
        try {
            await axiosInstance.put(`/auth/approve/${approvalData.user._id}`, { 
                assignedRole: approvalData.role 
            });
            toast.success(`${approvalData.user.fullName} approved as ${approvalData.role}`);
            setApprovalData(null); // Close modal
            fetchUsers(); // Refresh table
        } catch (error) {
            toast.error("Failed to approve user");
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">User Directory</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage system access and team roles.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <DataTable 
                    columns={getMemberColumns(handleApprovalRequest)} 
                    data={users} 
                    isLoading={isLoading}
                />
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