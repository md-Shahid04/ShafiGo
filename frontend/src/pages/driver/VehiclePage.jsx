import React, { useEffect, useState } from 'react';
import { vehicleApi } from '../../api/vehicleApi';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { VehicleManagerModal } from '../../components/driver/VehicleManagerModal';
import { showToast } from '../../store/uiSlice';
import { useDispatch } from 'react-redux';
import { Car, Bike, Shield, Plus, Check, CheckCircle2 } from 'lucide-react';

export const VehiclePage = () => {
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehicleApi.getDriverVehicles();
      if (res.success) {
        setVehicles(res.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      const res = await vehicleApi.setActiveVehicle(id);
      if (res.success) {
        dispatch(showToast({ type: 'success', message: 'Active vehicle updated' }));
        fetchVehicles();
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    }
  };

  const handleAddVehicle = async (data) => {
    setSubmitting(true);
    try {
      const res = await vehicleApi.addVehicle(data);
      if (res.success) {
        dispatch(showToast({ type: 'success', message: 'Vehicle registered successfully' }));
        setModalOpen(false);
        fetchVehicles();
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Vehicle Fleet</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your registered vehicles and switch active trip car.
          </p>
        </div>
        <Button
          size="sm"
          icon={Plus}
          onClick={() => setModalOpen(true)}
        >
          Add Vehicle
        </Button>
      </div>

      {loading ? (
        <Loader message="Loading vehicles..." />
      ) : vehicles.length === 0 ? (
        <Card className="p-8 text-center space-y-3">
          <Car className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No Vehicles Registered</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You need at least one active vehicle before you can go online and receive rides.
          </p>
          <Button size="sm" onClick={() => setModalOpen(true)} icon={Plus}>
            Register Vehicle
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <Card
              key={v.id}
              className={`p-5 border transition-all ${
                v.active
                  ? 'border-brand-500/50 bg-dark-900 ring-2 ring-brand-500/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      v.vehicleType === 'BIKE'
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                        : v.vehicleType === 'SUV'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    }`}
                  >
                    {v.vehicleType === 'BIKE' ? (
                      <Bike className="w-5 h-5" />
                    ) : v.vehicleType === 'SUV' ? (
                      <Shield className="w-5 h-5" />
                    ) : (
                      <Car className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      {v.brand} {v.model} ({v.year})
                    </h3>
                    <p className="text-xs text-slate-400">{v.color} • {v.vehicleType}</p>
                  </div>
                </div>

                {v.active && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  {v.registrationNumber}
                </span>

                {!v.active && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetActive(v.id)}
                  >
                    Set as Active
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <VehicleManagerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddVehicle={handleAddVehicle}
        loading={submitting}
      />
    </div>
  );
};

export default VehiclePage;
