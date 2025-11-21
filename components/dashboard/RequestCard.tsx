

// components/dashboard/RequestCard.tsx
import Link from 'next/link';
import BloodGroupBadge from './BloodGroupBadge'
import UrgencyBadge from './UrgencyBadge';
import { MapPin, Clock, Phone } from 'lucide-react';
import { formatDistance } from '@/lib/utils/distance';

interface RequestCardProps {
    request: {
        id: string;
        patientName: string;
        bloodGroup: string;
        urgency: string;
        unitsNeeded: number;
        hospitalName?: string | null;
        patientLocationName: string;
        distance: number;
        createdAt: Date;
        responseCount: number;
        canUserDonate: boolean;
    };
}

export default function RequestCard({ request }: RequestCardProps) {
    const timeAgo = getTimeAgo(new Date(request.createdAt));

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
                    <div>
                        <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                        <p className="text-sm text-gray-600">
                            {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'} needed
                        </p>
                    </div>
                </div>
                <UrgencyBadge urgency={request.urgency} />
            </div>

            <div className="space-y-2 mb-4">
                {request.hospitalName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-lg">🏥</span>
                        <span>{request.hospitalName}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{request.patientLocationName}</span>
                    <span className="text-red-600 font-medium">
                        • {formatDistance(request.distance)} away
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={16} />
                    <span>{timeAgo}</span>
                    {request.responseCount > 0 && (
                        <span className="ml-auto text-green-600 font-medium">
                            {request.responseCount} {request.responseCount === 1 ? 'response' : 'responses'}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <Link
                    href={`/requests/${request.id}`}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg font-medium hover:bg-gray-200 transition"
                >
                    View Details
                </Link>
                {request.canUserDonate && (
                    <Link
                        href={`/requests/${request.id}`}
                        className="flex-1 px-4 py-2 bg-red-600 text-white text-center rounded-lg font-medium hover:bg-red-700 transition"
                    >
                        I Can Donate
                    </Link>
                )}
            </div>
        </div>
    );
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}