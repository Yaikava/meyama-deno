let paths: string[] = [],
uniqueFilePathCounter = 0

export async function importDirectory(path: string) {
    path = path.replaceAll("\\", "/");
    const files = Deno.readDirSync(Deno.realPathSync(path));
  
    for (const file of files) {
      if (!file.name) continue;
  
      const currentPath = `${path}/${file.name}`;
      if (file.isFile) {
        if (!currentPath.endsWith(".ts")) continue;
        paths.push(
          `import "${Deno.mainModule.substring(0, Deno.mainModule.lastIndexOf("/"))}/${currentPath.substring(
            currentPath.indexOf("src/")
          )}#${uniqueFilePathCounter}";`
        );
        continue;
      }
  
      await importDirectory(currentPath);
    }
  
    uniqueFilePathCounter++;
  }
  
  /** Imports all everything in fileloader.ts */
  export async function fileLoader() {
    await Deno.writeTextFile("fileloader.ts", paths.join("\n").replaceAll("\\", "/"));
    await import(
      `${Deno.mainModule.substring(0, Deno.mainModule.lastIndexOf("/"))}/fileloader.ts#${uniqueFilePathCounter}`
    );
    paths = [];
  }