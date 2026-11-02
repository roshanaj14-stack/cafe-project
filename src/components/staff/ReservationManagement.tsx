import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';

export const ReservationManagement: React.FC = () => {
  const { reservations, updateReservationStatus } = useCafe();
  const [filterZone, setFilterZone] = useState<string>('all');

  const filteredReservations = reservations.filter((res) => {
    if (filterZone === 'all') return true;
    return res.seatingArea === filterZone;
  });

  const totalGuestsToday = reservations
    .filter((r) => r.status !== 'cancelled')
    .reduce((acc, r) => acc + r.guestsCount, 0);

  return (
    <div className="space-y-6">
      {/* Floor Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs">
          <span className="text-xs font-mono uppercase text-[#8C7A6B] block">
            Today's Bookings
          </span>
          <span className="font-mono text-2xl font-bold text-[#2B231B] tabular-nums mt-1 block">
            {reservations.length} tables booked
          </span>
          <span className="text-[11px] text-[#665A4F] mt-0.5 block">
            Estimated guest count: {totalGuestsToday} covers
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs">
          <span className="text-xs font-mono uppercase text-[#8C7A6B] block">
            Currently Seated Tables
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-700 tabular-nums mt-1 block">
            {reservations.filter((r) => r.status === 'seated').length} seated
          </span>
          <span className="text-[11px] text-[#665A4F] mt-0.5 block">
            Guests enjoying dining in salons
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs">
          <span className="text-xs font-mono uppercase text-[#8C7A6B] block">
            Upcoming Arrivals
          </span>
          <span className="font-mono text-2xl font-bold text-[#8C6D46] tabular-nums mt-1 block">
            {reservations.filter((r) => r.status === 'confirmed').length} expected
          </span>
          <span className="text-[11px] text-[#665A4F] mt-0.5 block">
            Tables prepped and reserved
          </span>
        </div>
      </div>

      {/* Zone filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs">
        {[
          { id: 'all', label: 'All Dining Zones' },
          { id: 'terrace', label: 'Street Terrace' },
          { id: 'velvet_booth', label: 'Emerald Booths' },
          { id: 'coffee_bar', label: 'Marble Counter' },
          { id: 'winter_garden', label: 'Winter Garden' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterZone(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterZone === tab.id
                ? 'bg-[#2B231B] text-white shadow-2xs'
                : 'bg-white border border-[#E2D8CC] text-[#5C5248] hover:border-[#8C6D46]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reservations Table */}
      <div className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#8C7A6B] uppercase font-mono text-[10px] border-b border-[#ECE5DC]">
              <tr>
                <th className="px-4 py-3">Ref / Time</th>
                <th className="px-4 py-3">Guest Contact</th>
                <th className="px-4 py-3">Party</th>
                <th className="px-4 py-3">Seating Zone & Notes</th>
                <th className="px-4 py-3">Table Status</th>
                <th className="px-4 py-3 text-right">Floor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE5DC]">
              {filteredReservations.map((res) => {
                const isConfirmed = res.status === 'confirmed';
                const isSeated = res.status === 'seated';
                const isCompleted = res.status === 'completed';

                return (
                  <tr key={res.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-[#2B231B]">{res.referenceCode}</div>
                      <div className="text-[11px] text-[#8C7A6B] font-medium">{res.timeSlot}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-[#2B231B]">{res.guestName}</div>
                      <div className="text-[11px] text-[#8C7A6B]">{res.guestPhone}</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono font-semibold text-[#2B231B]">
                      {res.guestsCount} guests
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-[#2B231B] capitalize">
                        {res.seatingArea.replace('_', ' ')}
                      </div>
                      {res.specialNotes && (
                        <div className="text-[11px] text-[#8C6D46] italic line-clamp-1">
                          "{res.specialNotes}"
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono capitalize ${
                          isConfirmed
                            ? 'bg-blue-50 text-blue-700'
                            : isSeated
                            ? 'bg-emerald-50 text-emerald-800'
                            : isCompleted
                            ? 'bg-neutral-100 text-neutral-600'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {isConfirmed && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'seated')}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            Seat Table
                          </button>
                        )}

                        {isSeated && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'completed')}
                            className="px-2.5 py-1 rounded bg-[#2B231B] hover:bg-[#43372B] text-white font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            Clear Table
                          </button>
                        )}

                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'cancelled')}
                            className="px-2 py-1 rounded border border-[#DDD5C7] text-[#8C7A6B] hover:text-red-700 hover:border-red-300 text-[11px] transition-colors cursor-pointer"
                            title="Cancel reservation"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
