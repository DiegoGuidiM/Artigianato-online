# CoWorkSpace — Frontend (ready-to-run)

This package contains map, rooms list, room detail (with demo calendar), and a fake payment screen.

## Structure

```
Progetto Sviluppo Web/
└─ frontend/
   ├─ map/               # home with search/offcanvas
   ├─ rooms/             # rooms list (enhanced)
   │  └─ room/           # room detail (enhanced)
   ├─ payment/           # fake checkout (coherent with theme)
   └─ images/            # backgrounds and assets
```

## How to run locally

Serve the `frontend/` folder with any static server:
- Python: `cd frontend && python3 -m http.server 5173`
- Node (serve): `npx serve frontend`

Then open:
- Map: `http://localhost:5173/map/index.html`
- Rooms: `http://localhost:5173/rooms/index.html`
- Room detail: `http://localhost:5173/rooms/room/room.html`
- Payment: `http://localhost:5173/payment/index.html`

## Assets

Make sure you have these images:
- `frontend/images/rooms_background.jpg` (used by rooms and room detail, payment)
- `frontend/images/sfondo_mappa.png` (map background)
- `frontend/images/italy.png` (map center image)

You can use Unsplash placeholders (download and save as above):
- https://images.unsplash.com/photo-1524758631624-e2822e304c36
- https://images.unsplash.com/photo-1504384308090-c894fdcc538d
- https://images.unsplash.com/photo-1522199710521-72d69614c702

## Notes

- All comments are in **English** on the enhanced screens.
- The calendar is **demo-only** (weekends busy).
- Clicking a free day shows a green **Book** button that leads to the Payment page.
- Logout redirection is configured in `map/app.js` (adjust the path if you move login).
