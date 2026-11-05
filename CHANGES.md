# What changed in this update

Nine features were added to the existing front-end demo (data still lives in memory; Firebase comes later).

| # | Feature | Where |
|---|---------|-------|
| 1 | Adults / kids / pets counts | `components/GuestPicker.jsx`, booking panel in `PropertyDetails.jsx`, search bar, `PropertyForm.jsx` (max guests + max pets), `utils/guests.js` |
| 2 | Monthly sales report | `pages/shared/Reports.jsx` (host: `/host/reports`, admin: `/admin/reports`) |
| 3 | Listing fee for hosts | `PropertyForm.jsx` (GCash step), `DataContext.listingFees`, fee amount in `AdminSettings.jsx` |
| 4 | Documents to post a rental | `components/DocumentPicker.jsx` in `PropertyForm.jsx`; admin checks them in `AdminProperties.jsx` |
| 5 | Change password | `components/ChangePassword.jsx` on `Profile.jsx` and `HostProfile.jsx`; `AuthContext.changePassword` |
| 6 | Reviews (guest side) | `ReservationDetails.jsx` (write, edit, delete), "Write a review" button in `Reservations.jsx` |
| 7 | Property image upload | `PropertyForm.jsx` (up to 5, cover photo, remove), `Photo.jsx` shows real images everywhere |
| 8 | Download / make reports | CSV download and Print / Save as PDF on the Reports page |
| 9 | Categories (Condo, Apartment, ...) | Category filter in `SearchBar.jsx` / `Explore.jsx`, category chips on `Home.jsx`, edited in Admin Settings |

## For the Firebase step
- Uploaded photos and documents are kept as data URLs in memory. Replace `readFile` in `utils/files.js` with a Firebase Storage upload and save the download URL. Keep documents private (Storage rules: only the host and admin can read).
- `AuthContext.changePassword` becomes `reauthenticateWithCredential` + `updatePassword`.
- New fields: `properties.maxPets / images / titleDocument`, `hostApplications.idDocument`, `bookings.adults / kids / pets`, `payments.paidAt`, and a new `listingFees` collection.
