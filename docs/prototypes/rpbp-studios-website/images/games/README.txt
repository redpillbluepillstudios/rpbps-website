Game images go here. The home page references these exact paths:

  sagitta-chains.png      -> Sagitta Chains (used in BOTH the hero and its game row)
  galactic-invaders.png   -> Galactic Invaders (its game row)

FRAME: the art tile is a SQUARE (1:1) with object-fit: cover, so:
  - Best: crop/export to a square, ~1000 x 1000 px.
  - Near-square gameplay screenshots (like the ones you pasted) work fine as-is;
    cover will trim a little off the top/bottom or sides to fill the square.

Until a file exists at the path above, the tile shows a colored letter placeholder
(red "S" / blue "G") instead of a broken image.
