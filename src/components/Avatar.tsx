import { avatarBg, initials } from '../utils/ui';

interface Props {
  name: string;
  size?: number;
  ring?: boolean;
}

export default function Avatar({ name, size = 44, ring = false }: Props) {
  const bg = avatarBg(name);
  const fs = Math.round(size * 0.4);
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${
        ring ? 'ring-2 ring-white shadow-soft' : ''
      }`}
      style={{ width: size, height: size, background: bg, fontSize: fs }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
