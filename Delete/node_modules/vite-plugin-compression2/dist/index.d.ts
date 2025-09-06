import { Plugin } from 'vite';
import { ZlibOptions, BrotliOptions } from 'zlib';
import { FilterPattern } from '@rollup/pluginutils';

type Algorithm = 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw';
interface UserCompressionOptions {
    [key: string]: any;
}
type InferDefault<T> = T extends infer K ? K : UserCompressionOptions;
type CompressionOptions<T> = InferDefault<T>;
type Pretty<T> = {
    [key in keyof T]: T[key] extends (...args: any[]) => any ? (...args: Parameters<T[key]>) => ReturnType<T[key]> : T[key] & NonNullable<unknown>;
} & NonNullable<unknown>;
interface BaseCompressionPluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    threshold?: number;
    filename?: string | ((id: string) => string);
    deleteOriginalAssets?: boolean;
    skipIfLargerOrEqual?: boolean;
}
interface AlgorithmToZlib {
    gzip: ZlibOptions;
    brotliCompress: BrotliOptions;
    deflate: ZlibOptions;
    deflateRaw: ZlibOptions;
}
type AlgorithmFunction<T extends UserCompressionOptions> = (buf: Buffer, options: T) => Promise<Buffer>;
type InternalCompressionPluginOptionsFunction<T> = {
    algorithm?: AlgorithmFunction<T>;
    compressionOptions: T;
};
type InternalWithoutCompressionPluginOptionsFunction = {
    algorithm?: AlgorithmFunction<undefined>;
};
type InternalCompressionPluginOptionsAlgorithm<A extends Algorithm> = {
    algorithm?: A;
    compressionOptions?: Pretty<AlgorithmToZlib[A]>;
};
type ViteCompressionPluginConfigFunction<T extends UserCompressionOptions> = BaseCompressionPluginOptions & InternalCompressionPluginOptionsFunction<T>;
type ViteWithoutCompressionPluginConfigFunction = Pretty<BaseCompressionPluginOptions & InternalWithoutCompressionPluginOptionsFunction>;
type ViteCompressionPluginConfigAlgorithm<A extends Algorithm> = BaseCompressionPluginOptions & InternalCompressionPluginOptionsAlgorithm<A>;
type ViteCompressionPluginConfig<T, A extends Algorithm> = ViteCompressionPluginConfigFunction<T> | ViteCompressionPluginConfigAlgorithm<A>;

declare function compression(): Plugin;
declare function compression<A extends Algorithm>(opts: Pretty<ViteCompressionPluginConfigAlgorithm<A>>): Plugin;
declare function compression<T extends UserCompressionOptions = NonNullable<unknown>>(opts: Pretty<ViteCompressionPluginConfigFunction<T>>): Plugin;
declare function compression(opts: ViteWithoutCompressionPluginConfigFunction): Plugin;

export { Algorithm, CompressionOptions, ViteCompressionPluginConfig, compression, compression as default };
