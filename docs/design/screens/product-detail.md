# Screen spec — Product detail (`/product/[id]`)

## Purpose & primary action

Read one product. **Primary action:** browse the gallery; secondary: the wishlist heart. Add to
cart and custom size are gated (below); makeup booking is out of scope.

## Page template

Single column on phone; at `lg` (≥1024) the gallery sits left and the info column right. The route
lives outside the tabs, so the tab bar and sidebar are hidden; the TopBar stays. A `ScreenHeader`
(back button → previous history, else Home) heads the page. Document title: `{product name} | Kikae`.

## Data required (one request)

`['product', id]` → `GET {apiUrl}/getProduct/{id}` (public). One request per product view; reviews
and comments are separate routes fetched on demand, never chained here. Plus one fire-and-forget
`POST /products/{id}/views` per visit (keyed on id, no retry, errors ignored) — it feeds views and
trending data.

### Product fields

The schema declares only these fields; the private store-owner data the backend embeds (email,
phone, OTP `code`, password-like `hash`, `balance`, `addresses`) is dropped, and a test proves the
rest never reaches state/logs: `id`, `name`, `price` (money), `old_price` (money, nullable),
`status`, `units`, `thrift` (nullable bool), `made_in_nigeria`, `description`, `media [{url}]`,
`sizes [{size}]`, `colours [{name, value}]`, `ratings [{rating}]`, `store {id, name, logo}`,
`likes [{user_id, like}]`, and for makeup `isMakeup`, `offer`, `coverages [{area, fee}]`.
`status !== "approved"` renders the not-available state. Image paths are relative
(`profile-pic/x.webp`); the `mediaUrl` helper resolves them (absolute URLs pass through).

## Content

- **Gallery** from `media[]` (see Gallery). **Name** is the `h1`.
- **Price**: `Price`; strikethrough `old_price` when `old_price > price`; "Free" when `price === 0`.
- **Stock**: "Sold out" when `units === 0`; "Only N left" when 1–3; nothing above 3.
- **Badges**: **Thrift** only (when `thrift`) — same as the old screen.
- **Sizes** `sizes[].size` and **Colours** `colours[].name` as read-only "Available in" tag lists
  (no swatches — colour `value` is `#000000` in samples). Selection arrives with the cart slice.
- **Description** expandable (collapsed by default with a show-more toggle).
- **Store row**: logo + name, a `Link` to `/store/[id]` (stub).
- **Rating summary**: plain text (star + rounded average, shown only when ratings exist, never NaN) —
  no links until the reviews and comments screens exist.
- **Heart**: liked = `likes.some(l => l.user_id === sessionUserId && (l.like === 1 || l.like ===
true))`. Add-only (no unlike route). Guests → `requireAuth` with `redirectTo` back; signed-in →
  optimistic save, disabled in-flight, rollback + toast on failure.

## Makeup service products (`isMakeup`)

Show coverage areas with fees (`coverages[{area, fee}]`) and availability (`offer`:
home / studio / both, plus an `availability` list of `{dated, available}` read-only rows) per the
real sample. Booking is out of scope.

## Old screen — what is NOT kept

| Old behavior          | Decision | Reason                                                                     |
| --------------------- | -------- | -------------------------------------------------------------------------- |
| Views counter         | keep     | One fire-and-forget POST per visit, keyed on id, no retry, errors ignored. |
| Share                 | defer    | Useful, but needs a web/native share decision.                             |
| Related products      | defer    | Needs an endpoint decision.                                                |
| Report product        | defer    | Trust/safety flow.                                                         |
| Fullscreen zoom       | defer    | "Zoom is deferred."                                                        |
| Variations modal      | replaced | Same data, rendered as inline size/colour chips.                           |
| Add to cart           | gated    | Hidden until `cartEnabled`.                                                |
| Custom size           | gated    | Hidden until `customSizeEnabled`; flow is F13 backlog.                     |
| Makeup "Book service" | defer    | Booking out of scope.                                                      |
| Vendor edit pencil    | drop     | F10 (vendor) scope.                                                        |

## Gallery & data cost

First image eager, the rest lazy; original URLs (`canResizeImages` is false); skeleton while
loading; no blurhash. Desktop (`lg`+) shows a thumbnail strip; phone shows a swipe pager with
labelled dots and prev/next buttons (a non-swipe alternative). Zoom is deferred.

## Capability flags

`cartEnabled` (false) hides the Add to cart bar; `customSizeEnabled` (false) hides the custom size
entry. Both stay hidden until flipped.

## States

Loading skeleton matching the layout; not found (HTTP 404, `status` false or empty data) / not
approved; error with Retry; offline (cached data stays, banner); sold out; no images (info renders
without the gallery); long description and long name (wrap/truncate, never shrink below 200%).

## Interactions

`ScreenHeader` back → previous history, else Home (TopBar stays; tab bar/sidebar hidden). Heart
(guest → `requireAuth`; signed-in → optimistic save, updating `['product', id]` and `['home']`).
Sizes/colours read-only. Store row → `/store/[id]` stub. Description toggle expands.

## Accessibility

One `h1` (product name); gallery dots + prev/next labelled; chips have `role` + selected state;
heart labelled "Add to wishlist" → "Saved"; ≥44px targets; two-tone focus; 200% text.

## Test cases

1. Populated: gallery + name + price + store + rating + heart render; exactly one product request
   and at most one views request.
2. Loading: skeleton matches the layout.
3. Not found (404 / `status` false / empty data) and `status !== "approved"`: not-available state.
4. Error: Retry.
5. Offline: cached data stays.
6. Sold out ("Sold out"); low stock ("Only N left"); Free (`price` 0).
7. No images: info renders without the gallery.
8. Long name/description wrap/truncate.
9. Sizes/colours render as read-only "Available in" tag lists (no swatches, no selection).
10. Rating summary is plain text (no links).
11. Heart liked derivation; guest → login; optimistic save syncs `['product', id]` and `['home']`.
12. ScreenHeader back falls back to Home when there is no history.
13. Schema privacy: private store fields are dropped from parsed state.

## Slices

- **A — Core read + gallery + makeup read-only + states (this task):** one request, gallery (first
  image eager, rest lazy, thumbnail strip / pager), name, price, stock, Thrift badge, read-only
  sizes/colours, description, store row, plain-text rating, heart, makeup coverage + availability,
  and the loading/error/not-found/offline/sold-out/no-images states.
- **B — Reviews & comments read-only:** list screens fed by the existing endpoints.
- **C — Write review & comment:** create forms.
- **D — Add to cart (with the cart):** gated by `cartEnabled`.
- **E — Custom size (with custom orders):** gated by `customSizeEnabled`.

**Slice A acceptance:** one `GET /getProduct/{id}` on load plus at most one views POST; renders name,
price (strikethrough/Free), stock, Thrift badge, read-only "Available in" size/colour tags,
description, store row, plain-text rating summary and heart; a test proves private store fields are
dropped; `status !== "approved"` and 404/`status` false/empty data show not-available; loading shows
a skeleton matching the layout.

## Questions

- Related products: which endpoint should back the rail when it returns?
- Is `/store/[id]` acceptable as a stub, or should the store row link elsewhere?
