import { Card, Skeleton } from "@campuskit/ui";

export function LoadingCards() {
  return <div className="equipment-grid">{Array.from({ length: 3 }, (_, index) => <Card aria-label="Loading equipment" key={index}><Skeleton label="Loading equipment" /><div className="skeleton-gap"><Skeleton width="65%" /><Skeleton width="40%" /></div></Card>)}</div>;
}

export function ErrorState({ message }: { message: string }) { return <div className="error-state" role="alert">{message}</div>; }
