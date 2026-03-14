import { AlbumState, Sticker, Team } from "./types";

export const teams: Team[] = [
  { code: "SPECIAL", name: "Special Stickers", totalStickers: 20 },
  { code: "MEX", name: "México", totalStickers: 20 },
  { code: "RSA", name: "Sudáfrica", totalStickers: 20 },
  { code: "KOR", name: "República de Corea", totalStickers: 20 },
  { code: "PLAYOFF_A", name: "Playoff A (DEN/MKD/CZE/IRL)", totalStickers: 20 },
  { code: "CAN", name: "Canadá", totalStickers: 20 },
  { code: "QAT", name: "Catar", totalStickers: 20 },
  { code: "SUI", name: "Suiza", totalStickers: 20 },
  { code: "PLAYOFF_B", name: "Playoff B (ITA/NIR/WAL/BIH)", totalStickers: 20 },
  { code: "BRA", name: "Brasil", totalStickers: 20 },
  { code: "MAR", name: "Marruecos", totalStickers: 20 },
  { code: "HAI", name: "Haití", totalStickers: 20 },
  { code: "SCO", name: "Escocia", totalStickers: 20 },
  { code: "USA", name: "EE. UU.", totalStickers: 20 },
  { code: "PAR", name: "Paraguay", totalStickers: 20 },
  { code: "AUS", name: "Australia", totalStickers: 20 },
  { code: "PLAYOFF_D", name: "Playoff D (TUR/ROU/SVK/KOS)", totalStickers: 20 },
  { code: "GER", name: "Alemania", totalStickers: 20 },
  { code: "CUW", name: "Curazao", totalStickers: 20 },
  { code: "CIV", name: "Costa de Marfil", totalStickers: 20 },
  { code: "ECU", name: "Ecuador", totalStickers: 20 },
  { code: "NED", name: "Países Bajos", totalStickers: 20 },
  { code: "JPN", name: "Japón", totalStickers: 20 },
  { code: "TUN", name: "Túnez", totalStickers: 20 },
  { code: "PLAYOFF_F", name: "Playoff F (UKR/SWE/POL/ALB)", totalStickers: 20 },
  { code: "BEL", name: "Bélgica", totalStickers: 20 },
  { code: "EGY", name: "Egipto", totalStickers: 20 },
  { code: "IRN", name: "RI de Irán", totalStickers: 20 },
  { code: "NZL", name: "Nueva Zelanda", totalStickers: 20 },
  { code: "ESP", name: "España", totalStickers: 20 },
  { code: "CPV", name: "Islas de Cabo Verde", totalStickers: 20 },
  { code: "KSA", name: "Arabia Saudí", totalStickers: 20 },
  { code: "URU", name: "Uruguay", totalStickers: 20 },
  { code: "FRA", name: "Francia", totalStickers: 20 },
  { code: "SEN", name: "Senegal", totalStickers: 20 },
  { code: "NOR", name: "Noruega", totalStickers: 20 },
  { code: "PLAYOFF_I", name: "Playoff I (BOL/SUR/IRQ)", totalStickers: 20 },
  { code: "ARG", name: "Argentina", totalStickers: 20 },
  { code: "ALG", name: "Argelia", totalStickers: 20 },
  { code: "AUT", name: "Austria", totalStickers: 20 },
  { code: "JOR", name: "Jordania", totalStickers: 20 },
  { code: "POR", name: "Portugal", totalStickers: 20 },
  { code: "UZB", name: "Uzbekistán", totalStickers: 20 },
  { code: "COL", name: "Colombia", totalStickers: 20 },
  { code: "PLAYOFF_K", name: "Playoff K (NCL/JAM/COD)", totalStickers: 20 },
  { code: "ENG", name: "Inglaterra", totalStickers: 20 },
  { code: "CRO", name: "Croacia", totalStickers: 20 },
  { code: "GHA", name: "Ghana", totalStickers: 20 },
  { code: "PAN", name: "Panamá", totalStickers: 20 },
];

export function generateInitialAlbum(): AlbumState {
  const stickers: Sticker[] = [];
  let stickerId = 1;

  for (const team of teams) {
    for (let i = 0; i < team.totalStickers; i++) {
      const globalNumber = stickerId;
      stickers.push({
        id: stickerId++,
        team: team.code,
        number: globalNumber,
        status: "missing",
        duplicates: 0,
      });
    }
  }

  return {
    teams,
    stickers,
  };
}

export const initialAlbum = generateInitialAlbum();
