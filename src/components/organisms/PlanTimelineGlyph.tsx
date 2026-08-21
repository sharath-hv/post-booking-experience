import styles from "./PlanList.module.scss";

export type PlanTimelineIcon = "documents" | "car" | "money" | "delivery";

const GLYPH = {
  className: styles.planGlyph,
  fill: "none",
  "aria-hidden": true,
} as const;

/** Stroke icons that inherit `currentColor` from the IconWell (purple / grey). */
export function PlanTimelineGlyph({ name }: { name: PlanTimelineIcon }) {
  switch (name) {
    case "documents":
      return (
        <svg {...GLYPH} width={20} height={20} viewBox="0 0 24 24">
          <path
            d="M14 3.5H10C6.22876 3.5 4.34315 3.5 3.17157 4.67157C2 5.84315 2 7.72876 2 11.5V12.5C2 16.2712 2 18.1569 3.17157 19.3284C4.34315 20.5 6.22876 20.5 10 20.5H14C17.7712 20.5 19.6569 20.5 20.8284 19.3284C22 18.1569 22 16.2712 22 12.5V11.5C22 7.72876 22 5.84315 20.8284 4.67157C19.6569 3.5 17.7712 3.5 14 3.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M5 16C6.03569 13.4189 9.89616 13.2491 11 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M9.75 9.75C9.75 10.7165 8.9665 11.5 8 11.5C7.0335 11.5 6.25 10.7165 6.25 9.75C6.25 8.7835 7.0335 8 8 8C8.9665 8 9.75 8.7835 9.75 9.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M14 8.5H19M14 12H19M14 15.5H16.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "car":
      return (
        <svg {...GLYPH} width={20} height={20} viewBox="0 0 24 24">
          <path
            d="M20.02 16.06C21.05 16.06 21.75 15.3 21.75 14.18V11.97C21.75 11.4 21.36 10.9 20.8 10.76L16.75 9.75L15.51 8.22C14.37 6.82 12.65 6 10.84 6H5.61C4.76 6 3.97 6.43 3.51 7.15L2.31 9.01C1.94 9.58 1.75 10.24 1.75 10.92V14.19C1.75 15.33 2.49 16.07 3.55 16.07"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit={10}
          />
          <path
            d="M17.3799 18.25C18.5899 18.25 19.5699 17.27 19.5699 16.06C19.5699 14.85 18.5899 13.87 17.3799 13.87C16.1699 13.87 15.1899 14.85 15.1899 16.06C15.1899 17.27 16.1699 18.25 17.3799 18.25Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M5.75006 18.25C6.96006 18.25 7.94006 17.27 7.94006 16.06C7.94006 14.85 6.96006 13.87 5.75006 13.87C4.54006 13.87 3.56006 14.85 3.56006 16.06C3.56006 17.27 4.54006 18.25 5.75006 18.25Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M2.21997 9.75H16.76"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit={10}
          />
          <path
            d="M8.46997 16.06H15.04"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit={10}
          />
        </svg>
      );
    case "money":
      return (
        <svg {...GLYPH} width={20} height={20} viewBox="0 0 24 24">
          <path
            d="M10.7 8C11.868 8 13.1862 9.1111 13.1 11C13.0175 12.8082 11.9 13.5714 9.5 13.5714L13.5 17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 10.8457H14.6243"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 8H14.7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "delivery":
      return (
        <svg {...GLYPH} width={20} height={20} viewBox="0 0 20 20">
          <path
            d="M3.1665 15.067C2.2915 15.067 1.6665 14.4503 1.6665 13.5003V10.7753C1.6665 10.2087 1.83317 9.65866 2.1415 9.18366L3.1415 7.62533C3.52484 7.03366 4.18317 6.66699 4.8915 6.66699H9.25817C9.53317 6.66699 9.80817 6.69199 10.0748 6.74199C11.2748 6.93366 12.3748 7.56699 13.1582 8.52533L14.1998 9.80033L17.5832 10.6503C18.0415 10.767 18.3748 11.1837 18.3748 11.6587V13.5003C18.3748 14.4337 17.7832 15.067 16.9248 15.067"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeMiterlimit={10}
          />
          <path
            d="M14.7166 16.8922C15.7249 16.8922 16.5416 16.0755 16.5416 15.0672C16.5416 14.0589 15.7249 13.2422 14.7166 13.2422C13.7083 13.2422 12.8916 14.0589 12.8916 15.0672C12.8916 16.0755 13.7083 16.8922 14.7166 16.8922Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M5.00811 16.8922C6.01644 16.8922 6.83311 16.0755 6.83311 15.0672C6.83311 14.0589 6.01644 13.2422 5.00811 13.2422C3.99977 13.2422 3.18311 14.0589 3.18311 15.0672C3.18311 16.0755 3.99977 16.8922 5.00811 16.8922Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M1.8999 9.80029H13.6666"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeMiterlimit={10}
            strokeLinecap="round"
          />
          <path
            d="M7.2832 15.0669H12.7665"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeMiterlimit={10}
          />
          <path
            d="M8.25 5.24512V14.9701"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeMiterlimit={10}
          />
          <path
            d="M4.1665 5.41699C4.1665 4.72699 4.78873 4.16699 5.55539 4.16699C7.61015 4.16699 8.33317 6.66699 8.33317 6.66699H5.55539C4.78873 6.66699 4.1665 6.10699 4.1665 5.41699Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.1108 6.66699H8.33301C8.33301 6.66699 9.05602 4.16699 11.1108 4.16699C11.8775 4.16699 12.4997 4.72699 12.4997 5.41699C12.4997 6.10699 11.8775 6.66699 11.1108 6.66699Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
