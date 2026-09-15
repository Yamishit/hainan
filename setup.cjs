const fs = require('node:fs/promises');
const path = require('node:path');
const root = __dirname;
const generated = 'C:/Users/shaokang/.codex/generated_images/01a0a2ec-b7d7-7cc1-8880-1d2c5608f6a1';
const assets = {
  characters: 'exec-5971549b-344d-4bf3-9bab-fc975f6dab6e.png',
  'rocket-salute': 'exec-4a1d4b59-cf85-4047-acc0-34b8c21c9fa7.png',
  surfing: 'exec-d67d47f3-e4ee-45bf-badd-446ae130e3a3.png',
  sandcastle: 'exec-2ac1579e-33e7-434d-8859-a3d93b38fd62.png',
  boat: 'exec-cb3d88e6-ecb4-4907-9292-1c014df02940.png',
  forest: 'exec-b06d6674-9027-475e-a0cb-3083a89a9c0e.png'
};
async function run() {
  for (const dir of ['art', 'images', 'fonts']) await fs.mkdir(path.join(root, dir), {recursive:true});
  for (const [name, file] of Object.entries(assets)) {
    await fs.copyFile(path.join(generated, file), path.join(root, 'art', name + '.png'));
  }
  await fs.copyFile(path.join(generated, 'exec-614aa4d9-0b08-4e45-bff2-633a4556c535.png'), path.join(root, 'images', '00-main-map.png'));
  for (const file of ['ZCOOLKuaiLe-Regular.ttf', 'OFL.txt']) {
    const response = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/zcoolkuaile/' + file);
    if (!response.ok) throw new Error(`Font download ${file}: ${response.status}`);
    await fs.writeFile(path.join(root, 'fonts', file), Buffer.from(await response.arrayBuffer()));
  }
  await fs.copyFile(path.join(root, '..', 'sources.md'), path.join(root, 'sources.md'));
  console.log('Six chibi assets, font and original photo-source notes copied.');
}
run().catch(error => {console.error(error); process.exitCode = 1;});
