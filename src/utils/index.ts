export function classNames(...classNameToIsPresent: string[]) {
  const classNames = [];
  for (let key in classNameToIsPresent) {
    if (classNameToIsPresent[key]) {
      classNames.push(classNameToIsPresent[key]);
    }
  }

  return classNames.join(" ");
}
