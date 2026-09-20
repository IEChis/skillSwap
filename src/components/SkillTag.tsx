import { CATEGORY_COLOR } from '../utils/matching';
import type { Category } from '../types';

interface Props {
  name: string;
  category?: Category;
  active?: boolean;
  onClick?: () => void;
}

export default function SkillTag({ name, category, active, onClick }: Props) {
  const color = category ? CATEGORY_COLOR[category] : '#4f46e5';
  const style = active
    ? { background: color, color: '#fff', borderColor: color }
    : { background: color + '14', color, borderColor: color + '33' };
  const cls = `tag border transition ${onClick ? 'cursor-pointer hover:brightness-95' : ''}`;
  if (onClick) {
    return (
      <button type="button" className={cls} style={style} onClick={onClick}>
        {name}
      </button>
    );
  }
  return (
    <span className={cls} style={style}>
      {name}
    </span>
  );
}
