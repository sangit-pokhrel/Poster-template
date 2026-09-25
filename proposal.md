# Promotional Poster Template Generator
## Full Project Proposal & System Architecture Design

**Reference application:** KrantiPatra Poster Creator — https://krantipatra.netlify.app/  
**Document purpose:** Product proposal, functional specification, UX layout, and technical system architecture.

> **Reference analysis note:** This proposal is based on the observable behavior and interface structure of the KrantiPatra application. The reference site's private source implementation, internal component tree, or backend code is not available for inspection. Therefore, "exact logic" below means reproducing the same observable workflow and interaction model: template selection → editable content → image upload/crop → canvas controls → live poster rendering → direct canvas repositioning → PNG export. The implementation should reproduce that behavior without copying proprietary source code.

---

# 1. Project Overview

The proposed system is a browser-based **Promotional Poster Template Generator** for creating Facebook, Instagram, Story, announcement, promotional, news-style, academic, business, and other social-media posters.

The application will be intentionally different from a full Canva clone.

The main concept is:

- The **left 50% of the application** is the control/editor workspace.
- The **right 50% of the application** is the real-time poster preview.
- The preview can be expanded into a **full-screen editing/preview mode**.
- The preview can be minimized back into the split-screen workspace.
- Users select a professionally designed template.
- Users edit only the content and visual properties permitted by that template.
- Uploaded photos become part of the poster canvas.
- The final poster is exported as a single PNG image.

The core philosophy is:

> **Users fill a designed template rather than designing a poster from scratch.**

---

# 2. Reference Analysis: KrantiPatra

The reference application exposes the following observable workflow and controls.

## 2.1 Application Header

The reference application has a compact header containing:

- Application/brand identity
- Language switch
- Auto-save indicator
- Reset
- Download Poster

The proposed system should retain the same functional idea:

```text
Brand / Template Studio
                 Auto Saved   Reset   Download
```

The header should remain compact and should not consume unnecessary workspace.

---

# 3. Reference Functional Logic

The reference application organizes the poster creation workflow into major control groups:

1. Text & Highlight
2. Templates
3. Photo & Crop
4. Date & Settings
5. Live Poster Preview
6. Download / Clipboard

The new application should preserve this logical grouping while adapting the interface to the requested 50/50 workspace.

---

# 4. Main User Interface

## 4.1 Desktop Layout

The main application should use approximately 50% of the viewport for editing controls and 50% for the actual poster.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ TEMPLATE STUDIO                           Auto Save   Reset   Download    │
├──────────────────────────────────┬───────────────────────────────────────┤
│                                  │                                       │
│        EDITOR / CONTROLS         │          LIVE POSTER PREVIEW          │
│                                  │                                       │
│  Templates                       │                                       │
│  ┌────┐ ┌────┐ ┌────┐            │                                       │
│  │ 01 │ │ 02 │ │ 03 │            │                                       │
│  └────┘ └────┘ └────┘            │                                       │
│                                  │                                       │
│  Text & Headings                 │           ┌──────────────┐            │
│  [ Main Heading ............. ]  │           │              │            │
│  [ Supporting Text .......... ]  │           │              │            │
│                                  │           │    POSTER    │            │
│  Photo                           │           │              │            │
│  [ Upload Photo ]                │           │              │            │
│                                  │           │              │            │
│  Photo 2 / 3 / 4                 │           └──────────────┘            │
│                                  │                                       │
│  Typography / Colors             │       Zoom     Full Screen            │
│  [ controls ................ ]   │                                       │
│                                  │                                       │
└──────────────────────────────────┴───────────────────────────────────────┘
```

The split should be responsive.

On smaller screens:

```text
EDITOR
   ↓
LIVE PREVIEW
```

or an editor/preview tab system can be used.

---

# 5. Right-Side Live Preview

The right side is not a static image.

It is a **real-time rendering surface**.

Every change made in the left editor must immediately update the poster.

Examples:

```text
Change heading
       ↓
Canvas updates immediately

Upload photo
       ↓
Photo appears immediately

Change photo zoom
       ↓
Photo changes immediately

Move heading
       ↓
Heading moves immediately

Change aspect ratio
       ↓
Canvas dimensions change immediately
```

The preview must always represent the current downloadable output.

---

# 6. Full-Screen / Minimize Preview

This is a required feature.

## Normal mode

```text
┌───────────────┬────────────────────┐
│   Controls    │   Live Poster      │
│     50%       │       50%          │
└───────────────┴────────────────────┘
```

## Full-screen preview mode

```text
┌─────────────────────────────────────────────┐
│                     [ Minimize ] [Download] │
│                                             │
│                                             │
│                ┌──────────────┐             │
│                │              │             │
│                │    POSTER    │             │
│                │              │             │
│                └──────────────┘             │
│                                             │
└─────────────────────────────────────────────┘
```

Full-screen mode should:

- hide editor controls
- center the poster
- preserve aspect ratio
- provide zoom
- provide minimize
- provide download
- keep all current edits

No state should be lost when switching modes.

---

# 7. Template System

The template system is the central feature.

Templates should be categorized similarly to the reference application.

Recommended categories:

- All
- Photo
- News
- Business
- Promotional
- Academic
- Events
- Sports
- Trending
- Social
- Story

Each template card should show a visual thumbnail.

Example:

```text
ALL

┌──────────┐ ┌──────────┐ ┌──────────┐
│          │ │          │ │          │
│ TEMPLATE │ │ TEMPLATE │ │ TEMPLATE │
│    01    │ │    02    │ │    03    │
│          │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘
```

Clicking a template loads it immediately.

---

# 8. Initial Template Library

The first release should contain approximately 15 templates.

## Photo

1. Full Photo
2. Corner Logo + Date
3. Center Logo + Accent
4. Photo + Headline

## News / Announcement

5. Classic News
6. Breaking Banner
7. Flash Alert
8. Headline + Photo

## Business

9. Service Promotion
10. Product Promotion
11. Company Announcement

## Academic

12. Achievement
13. Publication
14. Congratulations

## Social

15. Quote / Statement

Additional templates can be added without changing the editor architecture.

---

# 9. Template Data Model

Templates must be data-driven.

Do not create a separate HTML page for every template.

Example:

```javascript
{
  id: "achievement-01",
  name: "Academic Achievement",
  category: "academic",

  canvas: {
    width: 1080,
    height: 1350
  },

  elements: [
    {
      id: "logo",
      type: "image",
      role: "logo",
      editable: true
    },

    {
      id: "photo",
      type: "image",
      role: "photo",
      editable: true
    },

    {
      id: "heading",
      type: "text",
      role: "heading",
      editable: true,
      defaultText: "CONGRATULATIONS!"
    },

    {
      id: "name",
      type: "text",
      role: "name",
      editable: true,
      defaultText: "Your Name"
    }
  ]
}
```

This allows hundreds of templates to use the same editor.

---

# 10. Text Editing

The reference application allows headline editing and headline positioning.

The proposed system should expand this into reusable editable text elements.

Supported text properties:

- Content
- Font family
- Font size
- Font weight
- Color
- Alignment
- Line spacing
- Letter spacing
- X position
- Y position
- Width
- Rotation
- Opacity

The template determines which properties are exposed.

---

# 11. Heading / Highlight Logic

For templates that require highlighted words, the editor should support word-level highlighting.

Example:

```text
AI development slows down as
     ↑
highlight this word
```

The editor can display the headline as selectable words.

Clicking a word toggles its highlight state.

Internally:

```javascript
{
  text: "AI development slows down",
  highlights: [0, 3]
}
```

The renderer then applies the template's highlight style.

This reproduces the important observable behavior of the reference application without hard-coding a particular color for every template.

---

# 12. Photo Upload System

The reference application supports:

- Main photo upload
- Secondary photos
- JPG
- PNG
- WebP
- Drag-and-drop
- Sample images
- Multi-photo layouts

The proposed application should implement the same workflow.

## Main photo

```text
┌───────────────────────────────┐
│ Drag & Drop Photo Here        │
│                               │
│       or                      │
│                               │
│       [ Choose Photo ]        │
└───────────────────────────────┘
```

## Multi-photo

```text
Photo 1 [Upload]
Photo 2 [Upload]
Photo 3 [Upload]
Photo 4 [Upload]
```

Unused photo slots should automatically disappear from the final output.

---

# 13. Photo Adjustment Logic

The reference application exposes:

- Cover Crop
- Contain Fit
- Zoom
- Horizontal Pan
- Vertical Pan
- Gradient height

These controls should be retained.

## Photo state

```javascript
{
  source,
  fitMode: "cover",
  zoom: 1,
  panX: 0,
  panY: 0
}
```

## Cover

The image fills its assigned frame.

```text
┌──────────────┐
│██████████████│
│████ PHOTO ███│
│██████████████│
└──────────────┘
```

## Contain

The entire photo remains visible.

If the photo does not fill the frame, the template can render a background/blur layer according to the template rules.

---

# 14. Aspect Ratio System

The reference application supports:

- 1:1 — 1080 × 1080
- 4:5 — 1080 × 1350
- 16:9 — 1080 × 608
- 9:16 — 1080 × 1920

These four presets should be supported.

```text
[ 1:1 ] [ 4:5 ] [ 16:9 ] [ 9:16 ]
```

The active template should adapt its canvas.

Important:

The logical positions should be stored in normalized coordinates or relative coordinates where appropriate so that switching ratio does not destroy the design.

---

# 15. Date System

The reference application includes a date input and supports a Nepali/poster date.

The proposed application should support:

- Current date
- Custom date
- Nepali date text
- English date text
- Hide/show date

Example:

```text
Date
[ २५ भाद्र २०८३ ]

[ Use Today's Date ]
```

The date should be another editable template element.

---

# 16. Badge / Callout System

Promotional posters often require badges.

Examples:

```text
NEW
BREAKING
LIMITED OFFER
READ MORE
REGISTER NOW
VERIFIED
LIVE
```

The editor should provide:

```text
Badge Text
[________________]

Badge Style
[ Template Default ▼ ]

Show Badge
[ ON ]
```

The template controls the badge's position and visual style.

---

# 17. Footer System

Templates may contain:

- Website
- Social media handles
- Contact
- CTA
- Logo
- Social icons

Example:

```text
Website
[ www.example.com ]

Social Handle
[ @example ]

Show Footer
[ ON ]
```

---

# 18. Canvas Interaction

The reference application explicitly supports dragging the photo or heading directly on the canvas.

This behavior is essential.

Users should be able to:

- select an element
- drag it
- resize it
- reposition it
- rotate it where permitted

Example:

```text
          ┌──────────────────────┐
          │                      │
          │    MAIN HEADLINE     │
          │  ●──────────────●    │
          │  │              │    │
          │  │     PHOTO    │    │
          │  │              │    │
          │  ●──────────────●    │
          │                      │
          └──────────────────────┘
```

The editor should display selection handles only while editing.

Selection handles must never appear in the downloaded image.

---

# 19. Layer System

Every template element should have a layer.

Example:

```text
Layer 5  Logo
Layer 4  Heading
Layer 3  Photo
Layer 2  Gradient
Layer 1  Background
```

The system should support:

- Bring forward
- Send backward
- Bring to front
- Send to back

Templates may lock layers that should not be changed.

---

# 20. Locked Template Elements

Some elements should be protected.

For example:

```text
Brand Logo        LOCKED
Background        LOCKED
Main Photo        EDITABLE
Heading           EDITABLE
Name              EDITABLE
Footer            EDITABLE
```

This prevents users from accidentally destroying the template layout.

The admin/template author should determine which elements are editable.

---

# 21. Editor Modes

The system should have two editing levels.

## Quick Edit

For normal users:

```text
Headline
Name
Description
Photo
Logo
Date
```

## Advanced Edit

For users who want more control:

```text
Font
Size
Color
Position
Zoom
Pan
Opacity
Spacing
Alignment
Layer
```

This keeps the interface simple without removing functionality.

---

# 22. Export System

The downloaded image must contain everything.

The export pipeline should be:

```text
Template State
      ↓
Render Engine
      ↓
Off-screen Canvas
      ↓
Draw Background
      ↓
Draw Images
      ↓
Apply Crops
      ↓
Apply Gradients
      ↓
Draw Text
      ↓
Draw Logos / Icons
      ↓
Draw Badges / Footer
      ↓
Canvas.toBlob()
      ↓
PNG / JPG
      ↓
Browser Download
```

The user receives one flattened image.

Example:

```text
poster.png
1080 × 1350
```

No HTML elements are included in the exported file.

---

# 23. Copy to Clipboard

The reference application provides a copy-to-clipboard action.

The proposed application should retain this.

```text
[ Download PNG ] [ Copy Image ]
```

Where browser permissions allow it, the final rendered PNG is copied directly to the clipboard.

---

# 24. Auto-Save

The reference application visibly provides auto-save.

For the first version, auto-save should be local.

Use:

```text
localStorage
```

or preferably:

```text
IndexedDB
```

for larger image/state data.

Save:

- selected template
- text
- photo metadata
- photo transformations
- selected ratio
- colors
- dates
- element positions
- editor settings

The application should display:

```text
Saved
```

or:

```text
Saving...
```

---

# 25. Reset

Reset should restore the selected template to its original state.

Confirmation:

```text
Reset this poster?

[ Cancel ] [ Reset ]
```

Reset must not delete the template itself.

---

# 26. Recommended Frontend Architecture

## Technology

### Core

- React
- TypeScript
- Vite

### Styling

- Tailwind CSS
- CSS variables for template themes

### Canvas

Recommended:

- Fabric.js

Alternative:

- Konva.js

Fabric.js is recommended because the application requires:

- text objects
- images
- selection
- movement
- scaling
- rotation
- layers
- serialization
- canvas export

### State

Recommended:

- Zustand

### Image Processing

- Browser File API
- Canvas API
- Object URLs
- Fabric.js image objects

---

# 27. High-Level System Architecture

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         └──────────┬───────────┘
                                    │
                   ┌────────────────┴────────────────┐
                   │                                 │
                   ▼                                 ▼
          ┌─────────────────┐              ┌─────────────────┐
          │  Editor Panel   │              │  Live Preview   │
          └────────┬────────┘              └────────┬────────┘
                   │                                │
                   └────────────┬───────────────────┘
                                ▼
                       ┌──────────────────┐
                       │   Zustand Store  │
                       └────────┬─────────┘
                                │
               ┌────────────────┼─────────────────┐
               │                │                 │
               ▼                ▼                 ▼
        ┌────────────┐   ┌──────────────┐  ┌──────────────┐
        │ Templates  │   │ Canvas State │  │ User Assets  │
        └────────────┘   └──────────────┘  └──────────────┘
               │                │                 │
               └────────────────┼─────────────────┘
                                ▼
                       ┌──────────────────┐
                       │  Render Engine   │
                       │    Fabric.js    │
                       └────────┬─────────┘
                                │
                     ┌──────────┴──────────┐
                     ▼                     ▼
             ┌──────────────┐     ┌────────────────┐
             │ Live Canvas  │     │ Export Canvas  │
             └──────────────┘     └───────┬────────┘
                                          ▼
                                   PNG / JPG Blob
                                          │
                                          ▼
                                      Download
```

---

# 28. Component Architecture

```text
src/
│
├── app/
│   ├── App.tsx
│   └── routes.ts
│
├── components/
│   │
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   ├── EditorPanel.tsx
│   │   ├── PreviewPanel.tsx
│   │   └── Workspace.tsx
│   │
│   ├── templates/
│   │   ├── TemplateBrowser.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── TemplateCategory.tsx
│   │   └── TemplateGrid.tsx
│   │
│   ├── editor/
│   │   ├── TextEditor.tsx
│   │   ├── PhotoEditor.tsx
│   │   ├── DateEditor.tsx
│   │   ├── BadgeEditor.tsx
│   │   ├── FooterEditor.tsx
│   │   ├── TypographyEditor.tsx
│   │   └── LayerEditor.tsx
│   │
│   ├── canvas/
│   │   ├── PosterCanvas.tsx
│   │   ├── CanvasToolbar.tsx
│   │   ├── SelectionControls.tsx
│   │   └── FullscreenPreview.tsx
│   │
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Slider.tsx
│       ├── Tabs.tsx
│       └── Modal.tsx
│
├── data/
│   ├── templates/
│   │   ├── photo.ts
│   │   ├── news.ts
│   │   ├── business.ts
│   │   ├── academic.ts
│   │   └── social.ts
│   │
│   └── templateRegistry.ts
│
├── store/
│   ├── editorStore.ts
│   ├── canvasStore.ts
│   └── settingsStore.ts
│
├── services/
│   ├── canvasRenderer.ts
│   ├── exportService.ts
│   ├── imageService.ts
│   ├── storageService.ts
│   └── templateService.ts
│
├── types/
│   ├── template.ts
│   ├── element.ts
│   ├── photo.ts
│   └── editor.ts
│
└── utils/
    ├── coordinates.ts
    ├── aspectRatio.ts
    ├── date.ts
    └── validation.ts
```

---

# 29. Core State Architecture

The application should have one source of truth for the current poster.

Example:

```typescript
interface PosterState {
  templateId: string;

  canvas: {
    width: number;
    height: number;
    ratio: "1:1" | "4:5" | "16:9" | "9:16";
  };

  elements: PosterElement[];

  selectedElementId: string | null;

  zoom: number;

  fullscreen: boolean;

  saved: boolean;
}
```

Each element:

```typescript
interface PosterElement {
  id: string;

  type:
    | "text"
    | "image"
    | "shape"
    | "logo"
    | "badge";

  x: number;
  y: number;

  width: number;
  height: number;

  rotation: number;
  opacity: number;

  visible: boolean;
  locked: boolean;

  editable: boolean;

  data: unknown;
}
```

---

# 30. Template Loading Logic

When the user selects a template:

```text
User selects template
        ↓
Find template definition
        ↓
Create canvas
        ↓
Create template elements
        ↓
Load default values
        ↓
Load saved user state if available
        ↓
Render canvas
        ↓
Show live preview
```

Changing templates should replace the poster state with the new template's structure.

The application should ask before destroying unsaved changes if necessary.

---

# 31. Image Rendering Logic

For every image element:

```text
Source image
      ↓
Create image object
      ↓
Apply crop mode
      ↓
Apply zoom
      ↓
Apply X/Y pan
      ↓
Apply frame dimensions
      ↓
Clip to frame
      ↓
Render
```

This ensures the preview and downloaded image use the same visual result.

---

# 32. Coordinate System

Use a fixed logical design coordinate system.

For example:

```text
1080 × 1350
```

The displayed canvas can be:

```text
540 × 675
```

but internally remains:

```text
1080 × 1350
```

This is critical.

It means:

- browser scaling does not affect export
- dragging remains proportional
- exported image remains high quality
- full-screen mode does not change poster coordinates

---

# 33. Responsive Scaling

The preview should scale visually while preserving the logical canvas.

```text
Logical canvas:
1080 × 1350

Display:
480 × 600
```

The renderer should calculate:

```text
displayScale =
availablePreviewSize / logicalCanvasSize
```

User interactions are converted back into logical coordinates.

---

# 34. Full-Screen Logic

State:

```typescript
fullscreen: boolean
```

Normal:

```text
Editor = 50%
Preview = 50%
```

Fullscreen:

```text
Editor = hidden
Preview = 100%
```

The canvas itself does not change.

Only the container changes.

---

# 35. Download Logic

The application should never screenshot the visible browser UI.

Instead:

```text
Poster State
      ↓
Dedicated export canvas
      ↓
Render at target resolution
      ↓
canvas.toBlob()
      ↓
Create temporary URL
      ↓
Trigger browser download
      ↓
Revoke URL
```

This avoids:

- editor controls appearing in image
- selection boxes appearing
- browser scaling artifacts
- wrong output dimensions

---

# 36. Export Quality

Default export sizes:

| Ratio | Export |
|---|---:|
| 1:1 | 1080 × 1080 |
| 4:5 | 1080 × 1350 |
| 16:9 | 1080 × 608 |
| 9:16 | 1080 × 1920 |

Optional high-resolution mode can render at:

```text
2x
3x
```

when required.

---

# 37. Performance Strategy

The application should avoid unnecessary full-canvas recreation.

Use:

- debounced text updates where appropriate
- object caching
- lazy-loaded templates
- compressed thumbnails
- Object URLs for uploaded images
- separate preview and export rendering
- cleanup of object URLs
- memoized React components

Large original photos should not be stored repeatedly in React state.

---

# 38. Local Storage Strategy

Store configuration/state:

```text
templateId
text values
element positions
element transformations
settings
selected ratio
```

Avoid putting unnecessarily large binary image data into localStorage.

For larger temporary assets:

```text
IndexedDB
```

should be used.

---

# 39. Future Backend Architecture

The first version can work completely client-side.

A future version can add:

```text
                    ┌───────────────┐
                    │    React UI   │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │   API Layer   │
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
       Template API    Asset API       User API
             │              │              │
             ▼              ▼              ▼
        PostgreSQL       Object Storage   Auth
```

This would allow:

- user accounts
- cloud templates
- admin template management
- saved projects
- brand kits
- organization accounts
- template analytics

---

# 40. Admin Template Architecture

A future admin panel should allow:

```text
Templates
├── Create
├── Edit
├── Duplicate
├── Delete
├── Publish
├── Unpublish
└── Categorize
```

Template metadata:

```text
Template ID
Template Name
Category
Thumbnail
Supported Ratios
Elements
Default Values
Editable Elements
Locked Elements
Published Status
Created Date
Updated Date
```

This means new templates can eventually be added without changing application source code.

---

# 41. Security Considerations

Because the first version is client-side:

- uploaded images remain in the browser
- no image needs to be uploaded to a server
- no user account is required
- no personal image needs to leave the device

If cloud storage is introduced later:

- validate MIME type
- validate file size
- sanitize filenames
- use signed upload URLs
- restrict object access
- validate template JSON
- sanitize text used in SVG/HTML contexts

---

# 42. Accessibility

The editor should support:

- keyboard navigation
- visible focus states
- labels for controls
- accessible buttons
- keyboard escape for fullscreen
- sufficient text contrast
- alt text for UI preview thumbnails

The canvas itself should have an accessible fallback form for important editable fields.

---

# 43. Error Handling

Examples:

### Unsupported file

```text
This image format is not supported.
Please upload JPG, PNG, or WebP.
```

### Large file

```text
This image is too large.
Please choose an image below 10 MB.
```

### Export failure

```text
The poster could not be exported.
Please try again.
```

### Browser clipboard unsupported

```text
Copy to clipboard is not supported in this browser.
Use Download PNG instead.
```

---

# 44. User Journey

## Step 1

Open application.

## Step 2

Choose a template.

## Step 3

Template appears immediately on the right.

## Step 4

Enter/edit:

- headline
- text
- name
- date
- badge
- website

## Step 5

Upload photo.

## Step 6

Adjust:

- crop
- zoom
- position
- fit

## Step 7

Drag elements directly on the poster.

## Step 8

Change aspect ratio if required.

## Step 9

Click fullscreen if a larger preview is required.

## Step 10

Click Download.

## Step 11

Receive one complete PNG/JPG poster.

---

# 45. Example User Flow

```text
Open App
   │
   ▼
Choose "Promotion"
   │
   ▼
Choose Template
   │
   ▼
Template Loads
   │
   ├───────────────┐
   │               │
   ▼               ▼
Edit Text       Upload Photo
   │               │
   └───────┬───────┘
           ▼
      Live Preview
           │
           ▼
    Drag / Resize
           │
           ▼
     Fullscreen
           │
           ▼
     Download PNG
```

---

# 46. MVP Scope

The first production-ready version should contain:

### Workspace

- 50/50 editor and preview
- responsive layout
- fullscreen preview
- minimize preview

### Templates

- categories
- template thumbnails
- 15 initial templates

### Text

- editable heading
- editable body
- font size
- font family
- color
- alignment
- line spacing
- position

### Images

- main photo
- multi-photo
- drag and drop
- JPG/PNG/WebP
- crop
- cover
- contain
- zoom
- pan

### Canvas

- 1:1
- 4:5
- 16:9
- 9:16
- direct dragging
- element selection
- layers

### Settings

- date
- badge
- website
- footer
- logo

### Output

- PNG download
- JPG download
- clipboard copy
- correct export resolution

### Persistence

- auto-save
- reset

---

# 47. Phase 2

After MVP:

- user accounts
- cloud projects
- template favorites
- recently used templates
- duplicate project
- brand kit
- custom fonts
- custom logos
- template search
- template admin panel

---

# 48. Phase 3

Advanced platform:

- team workspaces
- template marketplace
- template analytics
- scheduled publishing
- social media integrations
- AI-assisted copy generation
- automatic image background removal
- bulk poster generation
- CSV-based bulk content
- brand consistency validation

---

# 49. Important Design Principle

The project should **not** become an unrestricted graphic design tool in the first release.

The primary interaction should remain:

```text
SELECT TEMPLATE
       ↓
FILL CONTENT
       ↓
ADJUST PHOTO
       ↓
ADJUST POSITION
       ↓
PREVIEW
       ↓
DOWNLOAD
```

This is the key functional model observed from KrantiPatra and should remain the foundation.

---

# 50. Final Architecture Summary

```text
┌──────────────────────────────────────────────────────────────┐
│                        TEMPLATE STUDIO                        │
├───────────────────────────────┬──────────────────────────────┤
│                               │                              │
│       EDITOR — ~50%           │       PREVIEW — ~50%         │
│                               │                              │
│  Template Categories          │                              │
│  Template Cards               │        Fabric Canvas         │
│                               │                              │
│  Text & Headings              │        Live Rendering         │
│  Photo Upload                 │                              │
│  Photo Crop                   │                              │
│  Typography                   │        Drag Elements          │
│  Date                         │                              │
│  Badge                        │        Zoom                   │
│  Footer                       │                              │
│  Position                     │        Fullscreen             │
│                               │                              │
└───────────────┬───────────────┴──────────────────┬───────────┘
                │                                  │
                └──────────────┬───────────────────┘
                               ▼
                      ┌─────────────────┐
                      │  Zustand State  │
                      └────────┬────────┘
                               ▼
                      ┌─────────────────┐
                      │ Template Engine │
                      └────────┬────────┘
                               ▼
                      ┌─────────────────┐
                      │ Fabric.js Canvas│
                      └────────┬────────┘
                               ▼
                      ┌─────────────────┐
                      │ Export Renderer │
                      └────────┬────────┘
                               ▼
                        PNG / JPG Output
```

---

# 51. Recommended Implementation Order

## Sprint 1 — Foundation

- React + Vite + TypeScript
- application shell
- 50/50 workspace
- responsive behavior
- fullscreen/minimize

## Sprint 2 — Template Engine

- template JSON schema
- template registry
- categories
- template thumbnails
- template loading

## Sprint 3 — Canvas

- Fabric.js integration
- text objects
- image objects
- selection
- drag
- resize
- layer handling

## Sprint 4 — Photo Engine

- upload
- drag/drop
- cover
- contain
- crop
- zoom
- pan
- multi-photo

## Sprint 5 — Editor Controls

- text controls
- typography
- date
- badge
- footer
- logo
- positioning

## Sprint 6 — Export

- PNG
- JPG
- clipboard
- export resolution
- clean export canvas

## Sprint 7 — Persistence

- auto-save
- reset
- restore session
- IndexedDB

## Sprint 8 — Template Library

- initial 15 templates
- categories
- responsive template thumbnails
- template metadata

## Sprint 9 — Testing

- export tests
- aspect ratio tests
- photo crop tests
- browser compatibility
- responsive testing
- large image testing

## Sprint 10 — Production Polish

- loading states
- error handling
- accessibility
- performance optimization
- final UI refinement

---

# 52. Definition of Done

The project is considered complete for MVP when a user can:

1. Open the application.
2. See templates on the left.
3. Select a template.
4. See the template immediately on the right.
5. Edit headings and other supported text.
6. Upload a photo.
7. Crop/zoom/pan the photo.
8. Add multiple photos where supported.
9. Change poster ratio.
10. Move supported elements directly on the canvas.
11. See every change in real time.
12. Open the preview fullscreen.
13. Minimize fullscreen mode.
14. Reset the design.
15. Return to a saved session.
16. Download the complete poster as PNG/JPG.
17. Receive a flattened image containing the photo, text, background, logo, badges, and all other visible poster components.

---

# 53. Final Product Concept

The final product should feel like:

> **A focused social-media poster generator, not a general-purpose design application.**

Its strongest UX characteristic should be the immediate relationship between:

**controls on the left → actual poster on the right**

with no separate preview page and no need to refresh.

The architecture should therefore treat the **template definition + editable state + canvas renderer** as the three central parts of the entire system.

The KrantiPatra-inspired functional sequence remains:

```text
Template
   ↓
Content
   ↓
Photo
   ↓
Crop / Position
   ↓
Aspect Ratio
   ↓
Live Canvas
   ↓
Direct Repositioning
   ↓
Fullscreen Preview
   ↓
PNG Export
```

This sequence should be preserved throughout implementation.
