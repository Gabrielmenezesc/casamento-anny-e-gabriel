import { AbsoluteFill, Composition, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type WeddingProps = { readonly names: string; readonly date: string };

export const WeddingIntro: React.FC<WeddingProps> = ({ names, date }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const imageIndex = Math.min(3, Math.floor(frame / (3 * fps)) + 1);
  const titleOpacity = interpolate(frame, [fps / 2, 2 * fps, 10 * fps, 11 * fps], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#100f12", color: "#fff", fontFamily: "Georgia, serif", overflow: "hidden" }}>
    <Img src={`http://127.0.0.1:8080/assets/images/galeria_${imageIndex}.jpg`} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: interpolate(frame % (3 * fps), [0, fps, 3 * fps - 1], [0, .92, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: interpolate(frame % (3 * fps), [0, 3 * fps], [1.02, 1.09], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(9,7,6,.7), transparent 60%, rgba(9,7,6,.2))" }} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80, opacity: titleOpacity }}>
      <div style={{ fontSize: 36, letterSpacing: 10, textTransform: "uppercase", color: "#e2bb67", marginBottom: 22 }}>Nosso grande dia</div>
      <div style={{ fontSize: 100, fontStyle: "italic", textShadow: "0 4px 30px #000" }}>{names}</div>
      <div style={{ fontSize: 34, marginTop: 28, letterSpacing: 4 }}>{date}</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

export const MyComposition: React.FC = () => <Composition id="AberturaCasamento" component={WeddingIntro} durationInFrames={150} fps={30} width={1280} height={720} defaultProps={{ names: "Laoanny & Gabriel", date: "25 de abril de 2027" }} />;
