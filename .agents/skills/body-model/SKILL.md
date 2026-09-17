# Body Model Skill

When implementing Body Mannequin features:
1. Treat height as absolute.
2. Derive head height from height/head-count.
3. Start from the sex-specific preset in `docs/body-model-spec.md`.
4. Apply weight only as an initial volume estimator.
5. Apply user sliders to numeric Body Spec values, never prompt adjectives.
6. Preserve total height when torso/leg lengths change.
7. Render all compared characters at one cm scale and one floor line.
8. Keep the mannequin visually minimal: white background, black contour lines, no face/hair/clothing/shading.
9. Do not normalize characters to equal display height.
10. Verify OxiHuman mapping empirically before freezing formulas.
