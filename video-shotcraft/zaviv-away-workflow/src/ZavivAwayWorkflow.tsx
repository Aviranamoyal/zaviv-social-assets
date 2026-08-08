import React from 'react';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const ORANGE = '#ff6a1a';
const ORANGE_SOFT = '#ff9b73';
const BLUE = '#1677ff';
const WHITE = '#f7f7f5';
const MUTED = '#a9adb8';
const BLACK = '#050608';
const FONT = '"Avenir Next", Avenir, Inter, ui-sans-serif, system-ui, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.2, 0.75, 0.25, 1);

const reveal = (frame: number, cue: number, duration = 16) =>
  interpolate(frame, [cue, cue + duration], [0, 1], {...clamp, easing: ease});

const BrandBackground: React.FC<{dim?: number; zoom?: number}> = ({dim = 0.2, zoom = 1}) => (
  <AbsoluteFill style={{background: BLACK, overflow: 'hidden'}}>
    <Img
      src={staticFile('images/campaign-background.png')}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `scale(${zoom})`,
        opacity: 0.96,
      }}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(5,6,8,${Math.min(0.9, dim + 0.16)}) 0%, rgba(5,6,8,${dim}) 46%, rgba(5,6,8,${Math.min(0.92, dim + 0.24)}) 100%)`,
      }}
    />
  </AbsoluteFill>
);

const BrandWordmark: React.FC<{size?: number; opacity?: number}> = ({size = 43, opacity = 1}) => (
  <div
    style={{
      color: WHITE,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: 9,
      lineHeight: 1,
      opacity,
      whiteSpace: 'nowrap',
    }}
  >
    ZΛVIV
  </div>
);

const SceneLabel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      color: ORANGE_SOFT,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: 5,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const CaptionBar: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      position: 'absolute',
      left: 82,
      right: 82,
      bottom: 112,
      minHeight: 92,
      padding: '22px 28px 20px',
      boxSizing: 'border-box',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 26,
      background: 'rgba(5,6,8,0.8)',
      boxShadow: '0 22px 70px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(18px)',
      color: WHITE,
      fontFamily: FONT,
      fontSize: 42,
      fontWeight: 600,
      lineHeight: 1.22,
      letterSpacing: -1.1,
      textAlign: 'center',
      zIndex: 90,
    }}
  >
    {text}
  </div>
);

const ProductCard: React.FC<{
  src: string;
  width: number;
  top: number;
  opacity?: number;
  scale?: number;
  lift?: number;
  children?: React.ReactNode;
}> = ({src, width, top, opacity = 1, scale = 1, lift = 0, children}) => {
  const height = width * 1.25;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        left: (1080 - width) / 2,
        top: top - lift,
        borderRadius: 40,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: `0 ${34 + lift}px ${90 + lift * 2}px rgba(0,0,0,0.62), 0 0 ${44 + lift * 2}px rgba(255,106,26,${0.08 + lift / 700})`,
        transform: `scale(${scale})`,
        transformOrigin: '50% 52%',
        opacity,
      }}
    >
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      {children}
    </div>
  );
};

const Header: React.FC<{
  frame: number;
  label: string;
  lines: Array<{text: string; color?: string}>;
  cue?: number;
  size?: number;
}> = ({frame, label, lines, cue = 0, size = 79}) => {
  const p = reveal(frame, cue, 18);
  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        right: 72,
        top: 76,
        textAlign: 'center',
        opacity: p,
        transform: `translateY(${24 * (1 - p)}px)`,
        zIndex: 60,
      }}
    >
      <SceneLabel>{label}</SceneLabel>
      <div style={{height: 20}} />
      {lines.map((line) => (
        <div
          key={line.text}
          style={{
            color: line.color ?? WHITE,
            fontFamily: FONT,
            fontWeight: 750,
            fontSize: size,
            lineHeight: 1.02,
            letterSpacing: -3.4,
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};

const PainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 134], [1, 1.12], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const vignette = interpolate(frame, [0, 134], [0.12, 0.62], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const panel = reveal(frame, 14, 20);
  const away = reveal(frame, 32, 14);
  const statuses = [
    {cue: 47, text: 'Agent needs input', meta: 'waiting', color: ORANGE},
    {cue: 67, text: 'Build completed', meta: 'ready', color: BLUE},
    {cue: 87, text: 'Deploy decision', meta: 'blocked', color: ORANGE},
  ];

  return (
    <AbsoluteFill style={{fontFamily: FONT, background: BLACK, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`}}>
        <BrandBackground dim={0.42} />
        <Img
          src={staticFile('images/live-terminal.png')}
          style={{
            position: 'absolute',
            left: 105,
            top: 310,
            width: 870,
            height: 1088,
            objectFit: 'cover',
            borderRadius: 56,
            opacity: 0.16,
            filter: 'saturate(.6) blur(5px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 105,
            right: 105,
            top: 530,
            height: 760,
            padding: 48,
            boxSizing: 'border-box',
            borderRadius: 38,
            border: '1px solid rgba(255,255,255,0.13)',
            background: 'linear-gradient(145deg, rgba(18,19,23,.98), rgba(6,7,9,.97))',
            boxShadow: '0 44px 110px rgba(0,0,0,.66)',
            opacity: panel,
            transform: `translateY(${26 * (1 - panel)}px)`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{width: 17, height: 17, borderRadius: 99, background: ORANGE, boxShadow: '0 0 28px rgba(255,106,26,.68)'}} />
            <div style={{color: MUTED, fontSize: 27, letterSpacing: 2.5, fontWeight: 650}}>DESK CONNECTION</div>
            <div style={{marginLeft: 'auto', color: '#6d717a', fontSize: 25}}>4:03 PM</div>
          </div>
          <div style={{height: 56}} />
          <div style={{opacity: away, transform: `translateY(${15 * (1 - away)}px)`}}>
            <div style={{color: WHITE, fontSize: 54, fontWeight: 720, letterSpacing: -2}}>You stepped away.</div>
            <div style={{color: '#7e838e', marginTop: 12, fontSize: 31}}>Your workflow didn’t.</div>
          </div>
          <div style={{height: 50}} />
          {statuses.map((status) => {
            const p = reveal(frame, status.cue, 13);
            return (
              <div
                key={status.text}
                style={{
                  height: 112,
                  marginBottom: 18,
                  padding: '0 26px',
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,.08)',
                  background: 'rgba(255,255,255,.035)',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: p,
                  transform: `translateY(${24 * (1 - p)}px)`,
                  filter: `blur(${7 * (1 - p)}px)`,
                }}
              >
                <div style={{width: 13, height: 13, borderRadius: 99, background: status.color, boxShadow: `0 0 20px ${status.color}`}} />
                <div style={{marginLeft: 19, color: WHITE, fontSize: 31, fontWeight: 620}}>{status.text}</div>
                <div style={{marginLeft: 'auto', color: status.color, fontSize: 24, fontWeight: 700}}>{status.meta}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Header
        frame={frame}
        label="The problem"
        lines={[
          {text: 'YOUR WORKFLOW'},
          {text: "SHOULDN’T HURT", color: ORANGE_SOFT},
          {text: 'WHEN YOU STEP AWAY.'},
        ]}
        cue={2}
        size={72}
      />
      <AbsoluteFill style={{pointerEvents: 'none', opacity: vignette, background: 'radial-gradient(ellipse 60% 50% at 50% 48%, transparent 34%, rgba(0,0,0,.98) 100%)'}} />
      <CaptionBar text="Your development workflow shouldn’t hurt when you step away." />
    </AbsoluteFill>
  );
};

const StatusIcon: React.FC<{progress: number; color: string}> = ({progress, color}) => {
  const ring = interpolate(progress, [0, 0.55, 0.8], [0.3, 1, 0], clamp);
  const done = interpolate(progress, [0.62, 1], [0, 1], clamp);
  return (
    <div style={{position: 'relative', width: 38, height: 38, flex: '0 0 auto'}}>
      <div
        style={{
          position: 'absolute',
          inset: 2,
          borderRadius: 99,
          border: '3px solid rgba(255,255,255,.23)',
          borderTopColor: color,
          opacity: ring,
          transform: `rotate(${progress * 120}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: 99,
          background: color,
          opacity: done,
          transform: `scale(${0.74 + done * 0.26})`,
          display: 'grid',
          placeItems: 'center',
          boxShadow: `0 0 22px ${color}66`,
        }}
      >
        <svg width="21" height="21" viewBox="0 0 20 20" fill="none">
          <path d="M4 10.3 8 14l8-9" stroke="#071016" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

const StreamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const panel = reveal(frame, 0, 18);
  const summary = reveal(frame, 18, 13);
  const rows = [
    {cue: 49, title: 'Coding agent kept running', meta: 'active', color: ORANGE},
    {cue: 67, title: 'Build finished successfully', meta: 'passed', color: BLUE},
    {cue: 82, title: 'Question is waiting for you', meta: 'needs input', color: ORANGE},
    {cue: 95, title: 'Live terminal stayed connected', meta: 'online', color: BLUE},
  ];
  const pulse = interpolate(frame, [116, 122, 130], [0.16, 0.62, 0.16], clamp);
  const complete = reveal(frame, 114, 13);
  const camera = interpolate(frame, [0, 120], [1.035, 1], {...clamp, easing: ease});

  return (
    <AbsoluteFill style={{fontFamily: FONT, background: BLACK, overflow: 'hidden'}}>
      <BrandBackground dim={0.47} />
      <Img
        src={staticFile('images/pixel-view.png')}
        style={{position: 'absolute', inset: -60, width: 1200, height: 1500, objectFit: 'cover', opacity: .12, filter: 'blur(6px) saturate(.6)', transform: `scale(${camera})`}}
      />
      <Header frame={frame} label="Still in motion" lines={[{text: 'WORK KEEPS MOVING.'}]} cue={3} size={80} />
      <div
        style={{
          position: 'absolute',
          left: 74,
          right: 74,
          top: 360,
          height: 1110,
          borderRadius: 38,
          border: `1px solid rgba(255,106,26,${pulse})`,
          background: 'linear-gradient(145deg, rgba(23,25,30,.985), rgba(7,8,11,.99))',
          boxShadow: '0 46px 110px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.06)',
          opacity: panel,
          transform: `translateY(${18 * (1 - panel)}px) scale(${.985 + panel * .015})`,
          overflow: 'hidden',
        }}
      >
        <div style={{height: 100, display: 'flex', alignItems: 'center', padding: '0 34px', borderBottom: '1px solid rgba(255,255,255,.075)'}}>
          <div style={{width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(135deg, #ff8a45, #1677ff)', display: 'grid', placeItems: 'center', color: WHITE, fontWeight: 800}}>Z</div>
          <div style={{marginLeft: 15, color: WHITE, fontSize: 29, fontWeight: 650}}>Away status</div>
          <div style={{marginLeft: 'auto', color: '#7d838e', fontSize: 23, display: 'flex', alignItems: 'center', gap: 10}}><span style={{width: 9, height: 9, borderRadius: 99, background: BLUE}} /> live</div>
        </div>
        <div style={{padding: '34px 34px 30px'}}>
          <div style={{height: 172, borderBottom: '1px solid rgba(255,255,255,.07)', opacity: summary, overflow: 'hidden'}}>
            <div style={{color: '#7e8590', fontSize: 21, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase'}}>Status summary</div>
            <div style={{marginTop: 15, color: WHITE, fontSize: 43, lineHeight: 1.2, fontWeight: 670, letterSpacing: -1.4}}>Your work continued after you left the desk.</div>
          </div>
          <div style={{height: 620, marginTop: 26}}>
            {rows.map((row, index) => {
              const body = reveal(frame, row.cue, 13);
              const status = reveal(frame, row.cue + 3, 9);
              return (
                <div
                  key={row.title}
                  style={{
                    height: 128,
                    marginBottom: 18,
                    padding: '0 25px',
                    boxSizing: 'border-box',
                    borderRadius: 22,
                    border: '1px solid rgba(255,255,255,.075)',
                    background: 'rgba(255,255,255,.028)',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: body,
                    transform: `translateY(${22 * (1 - body)}px)`,
                    filter: `blur(${7 * (1 - body)}px)`,
                  }}
                >
                  <StatusIcon progress={status} color={row.color} />
                  <div style={{marginLeft: 19, color: WHITE, fontSize: 30, fontWeight: 610, flex: 1}}>{row.title}</div>
                  <div style={{color: row.color, fontSize: 22, fontWeight: 700}}>{row.meta}</div>
                </div>
              );
            })}
          </div>
          <div style={{height: 90, borderTop: '1px solid rgba(255,255,255,.075)', display: 'flex', alignItems: 'flex-end', opacity: complete, transform: `translateY(${8 * (1 - complete)}px)`}}>
            <StatusIcon progress={complete} color={BLUE} />
            <div style={{marginLeft: 16, color: WHITE, fontSize: 27, fontWeight: 680}}>Everything is ready for your next move.</div>
          </div>
        </div>
      </div>
      <CaptionBar text="Agents run. Builds finish. Decisions wait." />
    </AbsoluteFill>
  );
};

const ThesisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = reveal(frame, 0, 11);
  const neq = spring({frame: frame - 17, fps: 30, config: {damping: 11, stiffness: 160}});
  const sub = reveal(frame, 46, 14);
  return (
    <AbsoluteFill style={{fontFamily: FONT, overflow: 'hidden', background: '#0a0b0e'}}>
      <BrandBackground dim={0.05} zoom={1.06} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(255,106,26,.17), transparent 44%, transparent 56%, rgba(22,119,255,.18))'}} />
      <div style={{position: 'absolute', left: 68, right: 68, top: 260, textAlign: 'center', opacity: p, transform: `scale(${.94 + p * .06})`}}>
        <SceneLabel>The reset</SceneLabel>
        <div style={{height: 74}} />
        <div style={{color: WHITE, fontSize: 89, lineHeight: 1.04, fontWeight: 760, letterSpacing: -4}}>AWAY FROM<br />YOUR DESK</div>
        <div
          style={{
            margin: '66px auto',
            width: 190,
            height: 190,
            borderRadius: 58,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #ff6a1a, #1677ff)',
            color: WHITE,
            fontSize: 118,
            fontWeight: 650,
            boxShadow: '0 28px 90px rgba(22,119,255,.22), 0 18px 70px rgba(255,106,26,.24)',
            transform: `scale(${neq}) rotate(${(1 - Math.min(1, neq)) * -7}deg)`,
          }}
        >
          ≠
        </div>
        <div style={{color: WHITE, fontSize: 89, lineHeight: 1.04, fontWeight: 760, letterSpacing: -4}}>AWAY FROM<br /><span style={{color: ORANGE_SOFT}}>DEVELOPMENT.</span></div>
      </div>
      <div style={{position: 'absolute', left: 100, right: 100, top: 1360, textAlign: 'center', color: MUTED, opacity: sub, fontSize: 34, lineHeight: 1.35, fontWeight: 560}}>Progress should travel with you.</div>
      <CaptionBar text="Without access, progress stalls—or you rush back to your desk." />
    </AbsoluteFill>
  );
};

const MachineCard: React.FC<{
  frame: number;
  cue: number;
  fromX: number;
  fromY: number;
  x: number;
  y: number;
  label: string;
  meta: string;
  color: string;
}> = ({frame, cue, fromX, fromY, x, y, label, meta, color}) => {
  const {fps} = useVideoConfig();
  const raw = spring({frame: frame - cue, fps, durationInFrames: 36, config: {damping: 16, stiffness: 68}});
  const t = Math.max(0, Math.min(1, raw));
  const px = fromX + (x - fromX) * t;
  const py = fromY + (y - fromY) * t - Math.sin(t * Math.PI) * 135;
  return (
    <div
      style={{
        position: 'absolute',
        left: px,
        top: py,
        width: 360,
        height: 132,
        padding: '0 25px',
        boxSizing: 'border-box',
        borderRadius: 25,
        border: `1px solid ${color}77`,
        background: 'rgba(12,14,18,.95)',
        boxShadow: `0 25px 60px rgba(0,0,0,.5), 0 0 28px ${color}22`,
        display: 'flex',
        alignItems: 'center',
        opacity: t,
        transform: `rotate(${(1 - t) * (fromX < 0 ? -7 : 7)}deg) scale(${.86 + t * .14})`,
        zIndex: 30,
      }}
    >
      <div style={{width: 45, height: 45, borderRadius: 14, border: `2px solid ${color}`, display: 'grid', placeItems: 'center', color, fontSize: 22, fontWeight: 800}}>›_</div>
      <div style={{marginLeft: 17}}>
        <div style={{color: WHITE, fontSize: 27, fontWeight: 700}}>{label}</div>
        <div style={{marginTop: 4, color, fontSize: 21, fontWeight: 650}}>{meta}</div>
      </div>
    </div>
  );
};

const ConnectScene: React.FC = () => {
  const frame = useCurrentFrame();
  const imageIn = reveal(frame, 0, 20);
  const line = reveal(frame, 30, 55);
  const hub = spring({frame: frame - 12, fps: 30, config: {damping: 13, stiffness: 120}});
  return (
    <AbsoluteFill style={{fontFamily: FONT, background: BLACK, overflow: 'hidden'}}>
      <BrandBackground dim={0.24} />
      <Header frame={frame} label="The bridge" lines={[{text: 'EVERY MACHINE.'}, {text: 'ONE POCKET.', color: ORANGE_SOFT}]} cue={0} size={77} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: line}}>
        <path d="M230 660 C270 810 410 950 540 1110" fill="none" stroke={ORANGE} strokeWidth="3" strokeDasharray="11 11" />
        <path d="M850 830 C790 930 680 1030 540 1110" fill="none" stroke={BLUE} strokeWidth="3" strokeDasharray="11 11" />
        <path d="M230 1110 C330 1110 430 1110 540 1110" fill="none" stroke={ORANGE_SOFT} strokeWidth="3" strokeDasharray="11 11" />
      </svg>
      <ProductCard src="images/pixel-view.png" width={610} top={474} opacity={imageIn * .62} scale={.94 + imageIn * .06} />
      <div
        style={{
          position: 'absolute',
          left: 420,
          top: 990,
          width: 240,
          height: 240,
          borderRadius: 68,
          background: 'linear-gradient(145deg, rgba(255,106,26,.98), rgba(22,119,255,.96))',
          boxShadow: '0 28px 100px rgba(0,0,0,.55), 0 0 70px rgba(22,119,255,.25)',
          display: 'grid',
          placeItems: 'center',
          transform: `scale(${hub})`,
          zIndex: 28,
        }}
      >
        <BrandWordmark size={31} />
      </div>
      <MachineCard frame={frame} cue={20} fromX={-420} fromY={960} x={48} y={600} label="Mac Studio" meta="agent running" color={ORANGE} />
      <MachineCard frame={frame} cue={34} fromX={1160} fromY={1160} x={672} y={790} label="Cloud VM" meta="terminal live" color={BLUE} />
      <MachineCard frame={frame} cue={48} fromX={-430} fromY={1430} x={48} y={1050} label="Laptop" meta="build ready" color={ORANGE_SOFT} />
      <CaptionBar text="Zaviv puts every machine, terminal, and coding agent in your pocket." />
    </AbsoluteFill>
  );
};

const ControlScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lock = reveal(frame, 38, 26);
  const lift = interpolate(frame, [46, 62, 116, 137], [0, 1, 1, 0], {...clamp, easing: ease});
  const scale = interpolate(frame, [0, 48, 73], [.92, .95, 1], {...clamp, easing: ease});
  const spotX = interpolate(frame, [0, 16, 30, 45], [14, 78, 35, 54], clamp);
  const spotY = interpolate(frame, [0, 16, 30, 45], [24, 38, 74, 52], clamp);
  const actions = [
    {cue: 70, text: 'SEE', color: ORANGE},
    {cue: 84, text: 'JOIN', color: WHITE},
    {cue: 98, text: 'RESPOND', color: BLUE},
  ];
  return (
    <AbsoluteFill style={{fontFamily: FONT, background: BLACK, overflow: 'hidden'}}>
      <BrandBackground dim={0.3} />
      <Header frame={frame} label="Live control" lines={[{text: 'SEE. JOIN. RESPOND.'}]} cue={0} size={78} />
      <ProductCard src="images/live-terminal.png" width={790} top={390} scale={scale} lift={lift * 22}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: .16 + lock * .26,
            background: `radial-gradient(circle 260px at ${spotX}% ${spotY}%, rgba(255,145,80,.62), transparent 66%)`,
            mixBlendMode: 'screen',
          }}
        />
        <div style={{position: 'absolute', inset: 0, border: `3px solid rgba(255,125,55,${lock * .72})`, borderRadius: 40, boxSizing: 'border-box'}} />
      </ProductCard>
      <div style={{position: 'absolute', left: 92, right: 92, top: 1472, height: 104, display: 'flex', gap: 18}}>
        {actions.map((action) => {
          const p = reveal(frame, action.cue, 12);
          return (
            <div
              key={action.text}
              style={{
                flex: 1,
                borderRadius: 25,
                border: `1px solid ${action.color}88`,
                background: 'rgba(7,8,10,.88)',
                display: 'grid',
                placeItems: 'center',
                color: action.color,
                fontSize: 29,
                fontWeight: 800,
                letterSpacing: 3,
                opacity: p,
                transform: `translateY(${18 * (1 - p)}px)`,
              }}
            >
              {action.text}
            </div>
          );
        })}
      </div>
      <CaptionBar text="See what’s running. Join the live session. Send the next instruction." />
    </AbsoluteFill>
  );
};

const IdeaCard: React.FC<{
  frame: number;
  cue: number;
  fromX: number;
  y: number;
  title: string;
  tag: string;
  color: string;
}> = ({frame, cue, fromX, y, title, tag, color}) => {
  const {fps} = useVideoConfig();
  const raw = spring({frame: frame - cue, fps, durationInFrames: 34, config: {damping: 15, stiffness: 72}});
  const t = Math.max(0, Math.min(1, raw));
  const x = fromX + (145 - fromX) * t;
  const py = y - Math.sin(t * Math.PI) * 120;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: py,
        width: 790,
        height: 126,
        borderRadius: 25,
        border: `1px solid ${color}66`,
        background: 'rgba(15,16,20,.96)',
        boxShadow: '0 24px 70px rgba(0,0,0,.52)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 26px',
        boxSizing: 'border-box',
        opacity: t,
        transform: `scale(${.88 + .12 * t}) rotate(${(1 - t) * (fromX > 1000 ? 5 : -5)}deg)`,
      }}
    >
      <div style={{width: 31, height: 31, borderRadius: 99, border: `3px solid ${color}`, boxSizing: 'border-box'}} />
      <div style={{marginLeft: 20, color: WHITE, fontSize: 29, fontWeight: 640, flex: 1}}>{title}</div>
      <div style={{padding: '9px 14px', borderRadius: 99, color, background: `${color}16`, fontSize: 20, fontWeight: 750}}>{tag}</div>
    </div>
  );
};

const TasksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const imageIn = reveal(frame, 0, 20);
  const settle = reveal(frame, 103, 18);
  return (
    <AbsoluteFill style={{fontFamily: FONT, background: BLACK, overflow: 'hidden'}}>
      <BrandBackground dim={0.3} />
      <Header frame={frame} label="From thought to work" lines={[{text: 'IDEAS BECOME'}, {text: 'TRACKED TASKS.', color: ORANGE_SOFT}]} cue={0} size={74} />
      <ProductCard src="images/tasks.png" width={790} top={390} opacity={imageIn * .5} scale={.96 + imageIn * .04} />
      <IdeaCard frame={frame} cue={24} fromX={-900} y={650} title="Fix the failing mobile build" tag="running" color={ORANGE} />
      <IdeaCard frame={frame} cue={40} fromX={1200} y={804} title="Review the agent’s plan" tag="waiting" color={BLUE} />
      <IdeaCard frame={frame} cue={56} fromX={-900} y={958} title="Ship the production patch" tag="ready" color={ORANGE_SOFT} />
      <div
        style={{
          position: 'absolute',
          left: 250,
          right: 250,
          top: 1170,
          height: 78,
          borderRadius: 25,
          background: 'linear-gradient(90deg, rgba(255,106,26,.94), rgba(22,119,255,.94))',
          color: WHITE,
          fontSize: 27,
          fontWeight: 750,
          display: 'grid',
          placeItems: 'center',
          opacity: settle,
          transform: `scale(${.92 + settle * .08})`,
          boxShadow: '0 18px 55px rgba(0,0,0,.4)',
        }}
      >
        WORK IS TRACKED
      </div>
      <CaptionBar text="Turn an idea into a tracked task—without returning to your desk." />
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleIn = reveal(frame, 0, 15);
  const titleOut = interpolate(frame, [52, 66], [1, 0], clamp);
  const send = reveal(frame, 18, 11);
  const textFly = interpolate(frame, [25, 39], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const morph = spring({frame: frame - 38, fps, durationInFrames: 36, config: {damping: 14, stiffness: 80}});
  const m = Math.max(0, Math.min(1, morph));
  const boxX = interpolate(m, [0, 1], [110, 250]);
  const boxY = interpolate(m, [0, 1], [790, 1055]);
  const boxW = interpolate(m, [0, 1], [860, 580]);
  const boxH = interpolate(m, [0, 1], [126, 12]);
  const boxR = interpolate(m, [0, 1], [30, 8]);
  const brand = reveal(frame, 64, 18);
  const tagline = reveal(frame, 82, 16);
  const drop = (cue: number) => spring({frame: frame - cue, fps, config: {damping: 12, stiffness: 120}});
  const dots = [
    {cue: 56, x: 320, y: 910, d: 25, color: ORANGE},
    {cue: 66, x: 746, y: 924, d: 19, color: BLUE},
    {cue: 76, x: 778, y: 889, d: 12, color: WHITE},
  ];
  const holdGlow = interpolate(frame, [78, 104, 149], [.08, .22, .12], clamp);
  return (
    <AbsoluteFill style={{fontFamily: FONT, background: BLACK, overflow: 'hidden'}}>
      <BrandBackground dim={0.15} zoom={1.03} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 214, textAlign: 'center', opacity: titleIn * titleOut, transform: `translateY(${22 * (1 - titleIn)}px)`}}>
        <SceneLabel>The freedom</SceneLabel>
        <div style={{height: 28}} />
        <div style={{color: WHITE, fontSize: 72, lineHeight: 1.08, fontWeight: 760, letterSpacing: -3.4}}>LEAVING YOUR COMPUTER</div>
        <div style={{marginTop: 10, color: ORANGE_SOFT, fontSize: 72, lineHeight: 1.08, fontWeight: 760, letterSpacing: -3.4}}>ISN’T LEAVING YOUR WORKFLOW.</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: boxX,
          top: boxY,
          width: boxW,
          height: boxH,
          borderRadius: boxR,
          border: `2px solid rgba(255,255,255,${.23 * (1 - m)})`,
          background: m > .6 ? 'linear-gradient(90deg, #ff6a1a, #1677ff)' : 'rgba(16,18,22,.94)',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          padding: m < .75 ? '0 32px' : 0,
          boxShadow: `0 0 70px rgba(22,119,255,${holdGlow})`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            color: WHITE,
            fontSize: 36,
            fontWeight: 560,
            whiteSpace: 'nowrap',
            opacity: (1 - textFly) * (1 - m),
            transform: `translate(${textFly * 700}px, ${textFly * -350}px) rotate(${textFly * -8}deg)`,
          }}
        >
          Keep shipping from anywhere
        </div>
        <div
          style={{
            marginLeft: 'auto',
            width: 68,
            height: 68,
            borderRadius: 19,
            background: send > 0 ? WHITE : ORANGE,
            opacity: 1 - m,
            display: 'grid',
            placeItems: 'center',
            transform: `scale(${1 - send * .12})`,
          }}
        >
          <svg width="31" height="31" viewBox="0 0 34 34"><path d="M3 17 31 4 20 30 15 19Z" fill="#111318" /></svg>
        </div>
      </div>
      {dots.map((dot) => {
        const s = drop(dot.cue);
        const y = interpolate(s, [0, 1], [-190, dot.y]);
        return (
          <div
            key={dot.cue}
            style={{
              position: 'absolute',
              left: dot.x,
              top: y,
              width: dot.d,
              height: dot.d,
              borderRadius: 99,
              background: dot.color,
              opacity: frame >= dot.cue ? 1 : 0,
              boxShadow: `0 0 26px ${dot.color}`,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 795,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: brand,
          transform: `translateY(${18 * (1 - brand)}px) scale(${1.12 - brand * .12})`,
          filter: `blur(${12 * (1 - brand)}px)`,
        }}
      >
        <BrandWordmark size={112} />
        <div style={{height: 158}} />
        <div style={{color: WHITE, fontSize: 52, fontWeight: 650, opacity: tagline, letterSpacing: -1.8}}>Keep shipping from anywhere.</div>
        <div style={{marginTop: 22, color: MUTED, fontSize: 27, opacity: tagline, letterSpacing: 1.2}}>YOUR DEVELOPMENT WORKFLOW, IN YOUR POCKET.</div>
      </div>
      <CaptionBar text={frame < 68 ? "Leaving your computer doesn’t mean leaving your workflow." : 'Zaviv. Keep shipping from anywhere.'} />
    </AbsoluteFill>
  );
};

const Soundtrack: React.FC<{bgm: boolean}> = ({bgm}) => {
  const {durationInFrames} = useVideoConfig();
  return (
    <>
      {bgm ? (
        <Audio
          src={staticFile('audio/music.mp3')}
          volume={(frame) => {
            const fadeIn = interpolate(frame, [0, 36], [0, 1], clamp);
            const fadeOut = interpolate(frame, [durationInFrames - 75, durationInFrames - 1], [1, 0], clamp);
            return 0.065 * fadeIn * fadeOut;
          }}
        />
      ) : null}
      <Sequence from={12}><Audio src={staticFile('audio/voiceover.m4a')} volume={1} /></Sequence>
      <Sequence from={5}><Audio src={staticFile('audio/transition-soft.mp3')} volume={0.12} /></Sequence>
      <Sequence from={144}><Audio src={staticFile('audio/transition-soft.mp3')} volume={0.13} /></Sequence>
      <Sequence from={282}><Audio src={staticFile('audio/whoosh-fast.mp3')} volume={0.17} /></Sequence>
      <Sequence from={303}><Audio src={staticFile('audio/impact.mp3')} volume={0.13} /></Sequence>
      <Sequence from={378}><Audio src={staticFile('audio/riser.mp3')} volume={0.1} /></Sequence>
      <Sequence from={538}><Audio src={staticFile('audio/whoosh-big.mp3')} volume={0.13} /></Sequence>
      <Sequence from={575}><Audio src={staticFile('audio/sparkle.mp3')} volume={0.11} /></Sequence>
      <Sequence from={677}><Audio src={staticFile('audio/transition-soft.mp3')} volume={0.11} /></Sequence>
      <Sequence from={691}><Audio src={staticFile('audio/whoosh-fast.mp3')} volume={0.14} /></Sequence>
      <Sequence from={804}><Audio src={staticFile('audio/click.mp3')} volume={0.11} /></Sequence>
      <Sequence from={838}><Audio src={staticFile('audio/riser.mp3')} volume={0.12} /></Sequence>
      <Sequence from={898}><Audio src={staticFile('audio/impact.mp3')} volume={0.17} /></Sequence>
      <Sequence from={922}><Audio src={staticFile('audio/sparkle.mp3')} volume={0.12} /></Sequence>
    </>
  );
};

export const ZavivAwayWorkflow: React.FC<{bgm: boolean}> = ({bgm}) => (
  <AbsoluteFill style={{background: BLACK}}>
    <Series>
      <Series.Sequence durationInFrames={135} premountFor={30}><PainScene /></Series.Sequence>
      <Series.Sequence durationInFrames={150} premountFor={30}><StreamScene /></Series.Sequence>
      <Series.Sequence durationInFrames={105} premountFor={30}><ThesisScene /></Series.Sequence>
      <Series.Sequence durationInFrames={150} premountFor={30}><ConnectScene /></Series.Sequence>
      <Series.Sequence durationInFrames={150} premountFor={30}><ControlScene /></Series.Sequence>
      <Series.Sequence durationInFrames={150} premountFor={30}><TasksScene /></Series.Sequence>
      <Series.Sequence durationInFrames={150} premountFor={30}><OutroScene /></Series.Sequence>
    </Series>
    <Soundtrack bgm={bgm} />
  </AbsoluteFill>
);
