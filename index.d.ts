import { SourceMapGenerator } from 'source-map';

declare function createGenerator(
  options?: createGenerator.Options
): createGenerator.Generator;

declare namespace createGenerator {
  interface Position {
    line: number;
    column: number;
  }

  interface Mapping {
    generated: Position;
    original?: Position;
  }

  interface Offset {
    line?: number;
    column?: number;
  }

  interface Options {
    file?: string;
    sourceRoot?: string;
    charset?: string;
  }

  interface SourceMap {
    version: number;
    sources: string[];
    names: string[];
    mappings: string;
    file: string;
    sourceRoot?: string;
    sourcesContent?: Array<string | null>;
  }

  interface InternalMapping {
    generatedLine: number;
    generatedColumn: number;
    originalLine: number | false;
    originalColumn: number | false;
    source: string | null;
    name: string | null;
  }

  class Generator {
    constructor(options?: Options);
    opts: Options;
    addMappings(sourceFile: string, mappings: Mapping[], offset?: Offset): this;
    addGeneratedMappings(sourceFile: string, source: string, offset?: Offset): this;
    addSourceContent(sourceFile: string, sourceContent: string): this;
    base64Encode(): string;
    inlineMappingUrl(): string;
    toJSON(): SourceMap;
    toString(): string;
    _mappings(): InternalMapping[];
    gen(): SourceMapGenerator;
  }
}

export = createGenerator;
