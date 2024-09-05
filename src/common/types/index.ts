export interface ResponseUrl {
  quote: string;
  character: Character;
  image: string;
  characterDirection: CharacterDirection;
}

export enum Character {
  HomerSimpson = "Homer Simpson",
  MilhouseVanHouten = "Milhouse Van Houten",
}

export enum CharacterDirection {
  Right = "Right",
}
