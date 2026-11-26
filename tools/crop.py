# Usage: python3 tools/crop.py in.png out_prefix [height=1400]  -> splits a tall screenshot into readable chunks
import sys
from PIL import Image
im=Image.open(sys.argv[1]); h=int(sys.argv[3]) if len(sys.argv)>3 else 1400
for i,y in enumerate(range(0, im.height, h)):
    im.crop((0,y,im.width,min(im.height,y+h))).save(f'{sys.argv[2]}{i}.png'); print(f'{sys.argv[2]}{i}.png')
