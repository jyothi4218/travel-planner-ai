"use client";
import { Hotel, X, Calendar, Users, Star, CheckCircle, Loader2, BedDouble, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type HotelBookingModalProps = {
  hotelName: string;
  destination: string;
  checkIn?: string;
  checkOut?: string;
  onClose: () => void;
};

const ROOM_TYPES = [
  { id: "standard", label: "Standard Room", price: 2500, icon: "🛏️", amenities: ["Free WiFi", "AC", "TV"] },
  { id: "deluxe", label: "Deluxe Room", price: 4200, icon: "🌟", amenities: ["Free WiFi", "AC", "TV", "Breakfast", "City View"] },
  { id: "suite", label: "Executive Suite", price: 7800, icon: "👑", amenities: ["Free WiFi", "AC", "TV", "Breakfast", "Pool Access", "Lounge Access"] },
];



const HotelBookingModal = ({ hotelName, destination, checkIn, checkOut, onClose }: HotelBookingModalProps) => {
  const [selectedRoom, setSelectedRoom] = useState("deluxe");
  const [guests, setGuests] = useState(2);
  const [checkInDate, setCheckInDate] = useState(checkIn || "");
  const [checkOutDate, setCheckOutDate] = useState(checkOut || "");
  const [step, setStep] = useState<"select" | "details" | "confirm" | "success">("select");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);

  useEffect(() => {
  if (!destination) return;

  const fetchHotels = async () => {
    setLoadingHotels(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hotels in ${destination}`
      );

      const data = await res.json();
      setHotels(data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }

    setLoadingHotels(false);
  };

  fetchHotels();
}, [destination]);

  const room = ROOM_TYPES.find(r => r.id === selectedRoom)!;
  const nights = checkInDate && checkOutDate
    ? Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  const totalPrice = room.price * nights * Math.ceil(guests / 2);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Your {room.label} at <span className="font-medium text-foreground">{hotelName}</span> has been reserved.
            A confirmation will be sent to <span className="font-medium text-foreground">{guestEmail}</span>.
          </p>
          <div className="bg-muted rounded-xl p-4 text-left text-sm mb-6 space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Hotel</span><span className="font-medium">{hotelName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span className="font-medium">{room.label}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="font-medium">{checkInDate}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="font-medium">{checkOutDate}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{guests}</span></div>
            <div className="flex justify-between border-t border-border pt-2 mt-2"><span className="font-semibold">Total Paid</span><span className="font-bold text-green-600">₹{totalPrice.toLocaleString()}</span></div>
          </div>
          <div className="text-xs text-muted-foreground mb-4">Booking ID: TPA-{Math.random().toString(36).substring(2,10).toUpperCase()}</div>
          <Button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-600 text-white">Back to Itinerary</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl max-w-lg w-full shadow-xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hotel className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Book Hotel</span>
            </div>
            <h2 className="font-bold text-lg leading-snug">
                  {hotels.length > 0
                    ? hotels[0].display_name.split(",")[0]
                    : hotelName}
                </h2>
            <p className="text-sm text-muted-foreground">{destination}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* Step: Room Selection */}
          {step === "select" && (
            <>
              {/* Dates & Guests */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Calendar className="w-3 h-3" /> Check-in</label>
                  <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-1">
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Calendar className="w-3 h-3" /> Check-out</label>
                  <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Users className="w-3 h-3" /> Guests</label>
                  <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
              </div>

              {/* Room Types */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-2"><BedDouble className="w-4 h-4" /> Select Room Type</p>
                <div className="space-y-3">
                  {ROOM_TYPES.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRoom(r.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedRoom === r.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-border hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{r.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{r.label}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {r.amenities.map(a => (
                                <span key={a} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{a}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-bold text-blue-600">₹{r.price.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-muted rounded-xl p-4 text-sm space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>₹{room.price.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""} × {Math.ceil(guests / 2)} room{Math.ceil(guests / 2) > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-blue-600">₹{totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Taxes & fees included</p>
              </div>
            </>
          )}

          {/* Step: Guest Details */}
          {step === "details" && (
            <div className="space-y-4">
              <p className="text-sm font-semibold">Guest Information</p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="As per ID"
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email Address</label>
                <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="For booking confirmation"
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Phone Number</label>
                <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="bg-muted rounded-xl p-4 text-sm space-y-1">
                <p className="font-semibold mb-2">Booking Summary</p>
                <div className="flex justify-between text-muted-foreground"><span>Hotel</span><span className="text-foreground font-medium">{hotelName}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Room</span><span className="text-foreground font-medium">{room.label}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Nights</span><span className="text-foreground font-medium">{nights}</span></div>
                <div className="flex justify-between font-bold border-t border-border pt-2 mt-1"><span>Total</span><span className="text-blue-600">₹{totalPrice.toLocaleString()}</span></div>
              </div>
            </div>
          )}

          {/* Step: Confirm & Pay */}
          {step === "confirm" && (
            <div className="space-y-4">
              <p className="text-sm font-semibold">Payment</p>
              <div className="space-y-3">
                {["💳 Credit / Debit Card", "🏦 Net Banking", "📱 UPI (GPay, PhonePe)", "💰 Pay at Hotel"].map(method => (
                  <div key={method} className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:border-blue-400 transition-all">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                      {method.includes("Credit") && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <span className="text-sm">{method}</span>
                  </div>
                ))}
              </div>
              <div className="bg-muted rounded-xl p-4 text-sm">
                <div className="flex justify-between font-bold"><span>Amount to Pay</span><span className="text-blue-600">₹{totalPrice.toLocaleString()}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex gap-3">
          {step !== "select" && (
            <Button variant="outline" onClick={() => setStep(step === "confirm" ? "details" : "select")} className="flex-1">Back</Button>
          )}
          {step === "select" && (
            <Button
              onClick={() => setStep("details")}
              disabled={!checkInDate || !checkOutDate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Continue to Details
            </Button>
          )}
          {step === "details" && (
            <Button
              onClick={() => setStep("confirm")}
              disabled={!guestName || !guestEmail || !guestPhone}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Proceed to Payment
            </Button>
          )}
          {step === "confirm" && (
            <Button onClick={handleConfirm} disabled={loading} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Confirming...</> : `Pay ₹${totalPrice.toLocaleString()} & Confirm`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelBookingModal;
