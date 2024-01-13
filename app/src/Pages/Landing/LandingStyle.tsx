type LandingStyleType = {
  container: React.CSSProperties;
  form: React.CSSProperties;
};

export const LandingStyle: LandingStyleType = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: "100%",
    flexDirection: "column",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 12,
    marginBottom: 12,
  },
};
