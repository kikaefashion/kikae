# Screen spec — Product detail (`/product/[id]`)

## Purpose & primary action

Read one product. **Primary action:** browse the gallery; secondary: the wishlist heart. Add to
cart and custom size are gated (below); makeup booking is out of scope.

## Page template

Single column on phone; at `lg` (≥1024) the gallery sits left and the info column right. The route
lives outside the tabs, so the tab bar and sidebar are hidden. Document title: `{product name} |
Kikae`.

## Data required (one request)

`['product', id]` → `GET {apiUrl}/getProduct/{id}` (public). One request per product view; reviews
and comments are separate routes fetched on demand, never chained here.

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
- **Sizes** `sizes[].size` as selectable chips. **Colours** `colours[].name` as text chips — every
  `value` in the samples is `#000000`, so never render swatches from it.
- **Description** expandable (collapsed by default with a show-more toggle).
- **Store row**: logo + name, a `Link` to `/store/[id]` (stub).
- **Rating summary**: star + rounded average, shown only when ratings exist (never NaN), with links
  to reviews and comments.
- **Heart**: liked = `likes.some(l => l.user_id === sessionUserId && (l.like === 1 || l.like ===
true))`. Add-only (no unlike route). Guests → `requireAuth` with `redirectTo` back; signed-in →
  optimistic save, disabled in-flight, rollback + toast on failure.

## Makeup service products (`isMakeup`)

Show coverage areas with fees (`coverages[{area, fee}]`) and availability (`offer`:
home / studio / both) read-only. Booking is out of scope.

## Old screen — what is NOT kept

| Old behavior          | Decision | Reason                                                  |
| --------------------- | -------- | ------------------------------------------------------- |
| Views counter         | defer    | Analytics; the old effect never re-ran on param change. |
| Share                 | defer    | Useful, but needs a web/native share decision.          |
| Related products      | defer    | Needs an endpoint decision.                             |
| Report product        | defer    | Trust/safety flow.                                      |
| Fullscreen zoom       | defer    | "Zoom is deferred."                                     |
| Variations modal      | replaced | Same data, rendered as inline size/colour chips.        |
| Add to cart           | gated    | Hidden until `cartEnabled`.                             |
| Custom size           | gated    | Hidden until `customSizeEnabled`; flow is F13 backlog.  |
| Makeup "Book service" | defer    | Booking out of scope.                                   |
| Vendor edit pencil    | drop     | F10 (vendor) scope.                                     |

## Gallery & data cost

First image eager, the rest lazy; original URLs (`canResizeImages` is false); skeleton while
loading; no blurhash. Desktop (`lg`+) shows a thumbnail strip; phone shows a swipe pager with
labelled dots and prev/next buttons (a non-swipe alternative). Zoom is deferred.

## Capability flags

`cartEnabled` (false) hides the Add to cart bar; `customSizeEnabled` (false) hides the custom size
entry. Both stay hidden until flipped.

## States

Loading skeleton matching the layout; not found / non-approved; error with Retry; offline (cached
data stays, banner); sold out; no images (info renders without the gallery); long description and
long name (wrap/truncate, never shrink below 200%).

## Interactions

Heart (guest → `requireAuth`; signed-in → optimistic save). Size/colour chips single-select. Store
row → `/store/[id]` stub. Reviews/comments links → their routes. Description toggle expands.

## Accessibility

One `h1` (product name); gallery dots + prev/next labelled; chips have `role` + selected state;
heart labelled "Add to wishlist" → "Saved"; ≥44px targets; two-tone focus; 200% text.

## Test cases

1. Populated: gallery + name + price + store + rating + heart render; exactly one request.
2. Loading: skeleton matches the layout.
3. Not found / `status !== "approved"`: not-available state.
4. Error: Retry.
5. Offline: cached data stays.
6. Sold out ("Sold out"); low stock ("Only N left"); Free (`price` 0).
7. No images: info renders without the gallery.
8. Long name/description wrap/truncate.
9. Sizes/colours select; colours are text-only (no swatches).
10. Heart liked derivation; guest → login; optimistic save + rollback.
11. Schema privacy: private store fields are dropped from parsed state.

## Slices

1. **Core read** — template, one request, gallery + name + price + stock + badges + sizes + colours
   - description + store row + rating + heart, with loading/error/not-found states.
2. **Gallery & data cost** — eager first image, lazy rest, thumbnail strip (desktop) / pager (phone).
3. **Makeup services** — coverage areas + availability, read-only.
4. **Resilience & a11y** — offline, long text, no images; accessibility + interactions.
5. **Gated actions** — Add to cart bar and custom size entry behind their flags.

**Slice 1 acceptance:** one `GET /getProduct/{id}` on load; renders name, price
(strikethrough/Free), stock, Thrift badge, size chips, colour text chips, description, store row,
rating summary and heart; a test proves private store fields are dropped; `status !== "approved"`
shows not-available; loading shows a skeleton matching the layout.

## Questions

- Makeup "availability slots": the sanitized payload was not provided and the old UI only rendered a
  static "Availability" label — is it `offer` (home/studio/both) or a separate slot list?
- Related products: which endpoint should back the rail when it returns?
- Is `/store/[id]` acceptable as a stub, or should the store row link elsewhere?
