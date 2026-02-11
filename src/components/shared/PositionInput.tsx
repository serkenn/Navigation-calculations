import { DMSInput } from './DMSInput';
import type { DMSValue } from '../../types/navigation';

interface PositionInputProps {
  lat: DMSValue;
  lon: DMSValue;
  onChangeLat: (v: DMSValue) => void;
  onChangeLon: (v: DMSValue) => void;
  latLabel?: string;
  lonLabel?: string;
}

export const PositionInput = ({
  lat, lon, onChangeLat, onChangeLon,
  latLabel = '緯度 (Lat)', lonLabel = '経度 (Lon)',
}: PositionInputProps) => (
  <div className="grid grid-cols-2 gap-4">
    <DMSInput label={latLabel} value={lat} onChange={onChangeLat} showSign signType="NS" />
    <DMSInput label={lonLabel} value={lon} onChange={onChangeLon} showSign signType="EW" />
  </div>
);
