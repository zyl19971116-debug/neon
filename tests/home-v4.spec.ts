import {expect,test} from '@playwright/test';

test('home V4 images, filtering and routes work',async({page},info)=>{
  test.skip(info.project.name==='mobile','Full home interaction path runs once on desktop');
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/',{waitUntil:'networkidle'});
  await expect(page.getByRole('heading',{name:/BUILD DRIVE COLLECT/i})).toBeVisible();
  const images=await page.locator('img').evaluateAll(nodes=>nodes.map(node=>({complete:(node as HTMLImageElement).complete,width:(node as HTMLImageElement).naturalWidth})));
  expect(images.length).toBeGreaterThanOrEqual(11);expect(images.every(image=>image.complete&&image.width>0)).toBe(true);
  await page.getByRole('button',{name:'Muscle'}).click();
  await expect(page.getByText('Sunset V8')).toBeVisible();
  await expect(page.getByText('Midnight Runner')).toHaveCount(0);
  await expect(page.getByRole('link',{name:/START BUILDING/})).toHaveAttribute('href','/garage');
  await expect(page.getByRole('link',{name:/VIEW ALL/})).toHaveAttribute('href','/market');
  await expect(page.getByRole('link',{name:/START CREATING/})).toHaveAttribute('href','/create');
  await expect(page.getByRole('link',{name:/LEARN MORE/})).toHaveAttribute('href','/create');
  expect(errors).toEqual([]);
});

test('home V4 mobile has no overflow and keeps real imagery visible',async({page},info)=>{
  test.skip(info.project.name!=='mobile','Mobile-specific visual contract');
  await page.goto('/',{waitUntil:'networkidle'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  await expect(page.getByRole('heading',{name:/BUILD DRIVE COLLECT/i})).toBeVisible();
  await expect(page.getByAltText(/Silver number 77/i)).toBeVisible();
  await expect(page.getByText('CREATOR ECONOMY')).toBeVisible();
});
