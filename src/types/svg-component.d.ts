
declare module '~virtual/svg-component' {
  const SvgIcon: (props: {
    name: "favicon",
    className?:string
    style?: React.CSSProperties
  })=> JSX.Element;
  export const svgNames: ["favicon"];
  export type SvgName = "favicon";
  export default SvgIcon;
}
