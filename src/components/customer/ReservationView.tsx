import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { SeatingArea, Reservation } from '../../types/cafe';
import { CheckCircle2, X, Compass } from 'lucide-react';

export const ReservationView: React.FC = () => {
  const { reservations, bookReservation, loyalty } = useCafe();

  const [guestName, setGuestName] = useState(loyalty.name || 'Roshan A.');
  const [guestEmail, setGuestEmail] = useState(loyalty.email || 'roshanaj14@gmail.com');
  const [guestPhone, setGuestPhone] = useState(loyalty.phone || '+1 (555) 544-3322');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('11:30 AM');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [seatingArea, setSeatingArea] = useState<SeatingArea>('terrace');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const seatingOptions: Array<{
    id: SeatingArea;
    title: string;
    description: string;
    atmosphere: string;
  }> = [
    {
      id: 'terrace',
      title: 'Parisian Street Terrace',
      description: 'Iconic street-facing round bistro tables under striped awnings with Saint-Germain views.',
      atmosphere: 'Lively, Sunlit & Quintessentially Paris',
    },
    {
      id: 'velvet_booth',
      title: 'Emerald Velvet Booth',
      description: 'Plush emerald velvet seating with warm brass sconces and intimate acoustics.',
      atmosphere: 'Cozy, Intimate & Quiet',
    },
    {
      id: 'coffee_bar',
      title: 'Marble Espresso Counter',
      description: 'High marble bar stools right in front of the La Marzocco machine for coffee lovers.',
      atmosphere: 'Artisanal & Coffee Enthusiast',
    },
    {
      id: 'winter_garden',
      title: 'Winter Garden Glasshouse',
      description: 'Bright glasshouse atrium filled with potted olive trees, skylights, and soft jazz.',
      atmosphere: 'Airy, Botanical & Serene',
    },
  ];

  const timeSlots = [
    '08:30 AM',
    '09:30 AM',
    '10:30 AM',
    '11:30 AM',
    '12:45 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = bookReservation({
      guestName,
      guestEmail,
      guestPhone,
      date,
      timeSlot,
      guestsCount,
      seatingArea,
      specialNotes: specialNotes.trim() || undefined,
    });
    setConfirmedReservation(created);
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6">
      {/* View Header */}
      <div className="pb-6 border-b border-[#E8E2D9]">
        <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D46] block">
          Hospitality & Dining
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B231B] mt-1">
          Table Reservations in Saint-Germain
        </h1>
        <p className="text-sm text-[#665A4F] mt-1 max-w-2xl">
          Reserve your preferred table for a leisurely breakfast, coffee tasting, or weekend midday brunch.
        </p>
      </div>

      {/* Confirmation Modal if just booked */}
      {confirmedReservation && (
        <div className="my-8 p-6 sm:p-8 bg-emerald-50/80 border border-emerald-200 rounded-3xl shadow-sm animate-in fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-800">
                  Reservation Confirmed
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#2B231B]">
                  Welcome to Les Amis, {confirmedReservation.guestName}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setConfirmedReservation(null)}
              className="p-1 text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/80 rounded-2xl border border-emerald-200/60 text-xs">
            <div>
              <span className="text-[#8C7A6B] block">Reference Code:</span>
              <span className="font-mono font-bold text-sm text-[#2B231B]">
                {confirmedReservation.referenceCode}
              </span>
            </div>
            <div>
              <span className="text-[#8C7A6B] block">Date & Time:</span>
              <span className="font-semibold text-[#2B231B]">
                {confirmedReservation.date} · {confirmedReservation.timeSlot}
              </span>
            </div>
            <div>
              <span className="text-[#8C7A6B] block">Party Size:</span>
              <span className="font-semibold text-[#2B231B]">
                {confirmedReservation.guestsCount} guests
              </span>
            </div>
            <div>
              <span className="text-[#8C7A6B] block">Seating Area:</span>
              <span className="font-semibold text-[#2B231B] capitalize">
                {confirmedReservation.seatingArea.replace('_', ' ')}
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-800 mt-4">
            A confirmation receipt has been sent to {confirmedReservation.guestEmail}. Your table will be held for 15 minutes past your reservation time.
          </p>
        </div>
      )}

      {/* Main Reservation Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Booking Form (Left 7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-6">
          <h2 className="text-xl font-serif font-bold text-[#2B231B] border-b border-[#E8E2D9] pb-3">
            Plan Your Visit
          </h2>

          {/* Date, Time, Guests Count Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] text-[#2B231B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-1.5">
                Guests
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                className="w-full text-xs p-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] text-[#2B231B] cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-1.5">
                Time Window
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] text-[#2B231B] cursor-pointer"
              >
                {timeSlots.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seating Zones Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-2">
              Seating Ambience & Zone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seatingOptions.map((opt) => {
                const isSelected = seatingArea === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSeatingArea(opt.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#8C6D46] bg-[#F4EDE2] shadow-2xs'
                        : 'border-[#E2D8CC] bg-[#FAF8F5] hover:border-[#8C6D46]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#2B231B]">
                        {opt.title}
                      </h4>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6D46]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#665A4F] mt-1 leading-snug">
                      {opt.description}
                    </p>
                    <span className="text-[10px] font-mono text-[#8C6D46] mt-2 block">
                      {opt.atmosphere}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-3 pt-2 border-t border-[#E8E2D9]">
            <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider">
              Primary Guest Contact
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Full Name"
                className="text-xs p-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] text-[#2B231B]"
              />
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="Mobile Number"
                className="text-xs p-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] text-[#2B231B]"
              />
            </div>
            <input
              type="email"
              required
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Confirmation Email Address"
              className="w-full text-xs p-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] text-[#2B231B]"
            />
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-1.5">
              Special Occasion or Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Anniversary, stroller space, quiet reading corner, allergy accommodations..."
              className="w-full text-xs p-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] text-[#2B231B]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-[#2B231B] hover:bg-[#43372B] transition-colors cursor-pointer shadow-md"
          >
            Confirm Reservation Instantly
          </button>
        </form>

        {/* Existing Reservations Card (Right 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF8F5] border border-[#E5DDD0] rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C6D46]">
              <Compass className="w-4 h-4" />
              <span>Your Bookings</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2B231B] mt-1">
              Guest Schedule
            </h3>

            <div className="mt-4 space-y-3">
              {reservations.length === 0 ? (
                <p className="text-xs text-[#8C7A6B]">
                  No past or upcoming reservations on file.
                </p>
              ) : (
                reservations.slice(0, 3).map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-white border border-[#E5DDD0] text-xs shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#2B231B]">
                        {res.referenceCode}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                          res.status === 'confirmed'
                            ? 'bg-blue-50 text-blue-800'
                            : res.status === 'seated'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>

                    <p className="text-[#2B231B] font-medium">
                      {res.date} · {res.timeSlot} ({res.guestsCount} guests)
                    </p>

                    <p className="text-[#8C7A6B] text-[11px] capitalize">
                      Zone: {res.seatingArea.replace('_', ' ')}
                    </p>

                    {res.specialNotes && (
                      <p className="text-[10px] italic text-[#665A4F] pt-1 border-t border-[#ECE5DC]">
                        "{res.specialNotes}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cafe Policy Card */}
          <div className="bg-white border border-[#E5DDD0] rounded-3xl p-6 text-xs text-[#665A4F] space-y-2">
            <h4 className="font-serif font-bold text-[#2B231B] text-sm">
              Practical Information
            </h4>
            <p>
              • <strong>Terrace:</strong> Cozy fleece blankets provided during brisk Paris mornings.
            </p>
            <p>
              • <strong>Cancellation:</strong> Modify or cancel freely up to 1 hour prior to arrival.
            </p>
            <p>
              • <strong>Location:</strong> 18 Rue de l’Ancienne Comédie, 75006 Paris (Odéon Station).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
