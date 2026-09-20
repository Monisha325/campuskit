# CampusKit availability widget

Build the browser bundle:

```bash
corepack pnpm --filter @campuskit/availability-widget build
```

Then host `dist/availability-widget.js` and embed it on any site:

```html
<div id="campuskit-availability"></div>
<script src="/availability-widget.js"></script>
<script>
  CampusKitAvailability.createAvailabilityWidget("#campuskit-availability", {
    apiBaseUrl: "https://your-api.example.com",
    equipmentId: 1
  });
</script>
```

If the host page loads CampusKit token CSS, the widget inherits its active theme; otherwise it falls back to neutral standalone styles.
