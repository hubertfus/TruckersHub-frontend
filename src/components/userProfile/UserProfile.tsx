import { User, Phone, Mail, IdCard, Calendar } from 'lucide-react';
import { UserData } from '../../pages/userDetails/UserDetails';



export function UserProfile({ name, email, role, phone, license_number, availability, created_at }: UserData) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
              {(role?.charAt(0).toUpperCase() + role?.slice(1)) || 'Unknown Role'}
            </span>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full ${availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {availability ? 'Available' : 'Unavailable'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">{email}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">{phone}</span>
        </div>
        <div className="flex items-center space-x-3">
          <IdCard className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">License: {license_number}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">Joined: {new Date(created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}