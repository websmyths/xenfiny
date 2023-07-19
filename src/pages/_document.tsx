import { NextPageContext } from 'next';
import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyles, createStylesServer } from '@mantine/next';

const getInitialProps = createGetInitialProps();
// optional: you can provide your cache as a first argument in createStylesServer function
const stylesServer = createStylesServer();

export default class _Document extends Document {
    static async getInitialProps(ctx: NextPageContext) {
        const initialProps = await Document.getInitialProps(ctx as DocumentContext);

        // Add your app specific logic here

        return {
            ...initialProps,
            styles: [
                initialProps.styles,
                <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />,
            ],
        };
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}