import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Navigation, CheckCircle2, Play, Flag, XCircle } from 'lucide-react';

export const RideActionControls = ({
  ride,
  onArriving,
  onArrived,
  onStartRide,
  onCompleteRide,
  onCancelRide,
  loading = false,
}) => {
  if (!ride) return null;

  return (
    <div className="space-y-3">
      {ride.status === 'DRIVER_ACCEPTED' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="secondary"
            icon={Navigation}
            onClick={onArriving}
            loading={loading}
          >
            Heading to Pickup
          </Button>
          <Button
            variant="primary"
            icon={CheckCircle2}
            onClick={onArrived}
            loading={loading}
          >
            Arrived at Pickup
          </Button>
        </div>
      )}

      {ride.status === 'DRIVER_ARRIVING' && (
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon={CheckCircle2}
          onClick={onArrived}
          loading={loading}
        >
          Confirm Arrival at Pickup
        </Button>
      )}

      {ride.status === 'DRIVER_ARRIVED' && (
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon={Play}
          onClick={onStartRide}
          loading={loading}
          className="bg-brand-500 hover:bg-brand-600 text-dark-950 font-bold"
        >
          Start Trip (Rider Onboard)
        </Button>
      )}

      {ride.status === 'RIDE_STARTED' && (
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon={Flag}
          onClick={onCompleteRide}
          loading={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-dark-950 font-bold shadow-xl shadow-emerald-500/20"
        >
          Complete Ride & Collect Fare
        </Button>
      )}

      {ride.status !== 'RIDE_STARTED' && ride.status !== 'RIDE_COMPLETED' && (
        <div className="pt-2">
          <Button
            variant="ghost"
            fullWidth
            size="sm"
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
            icon={XCircle}
            onClick={onCancelRide}
          >
            Cancel Trip
          </Button>
        </div>
      )}
    </div>
  );
};

export default RideActionControls;
