import { useState } from 'react';
import {
    Box,
    Card,
    Container,
    Title,
    Text,
    Button,
    Stack,
    Center,
    Loader,
    Alert,
    Grid,
    Tabs,
    List,
    NumberInput,
    Select,
    Slider,
    Switch,
    Textarea,
    ThemeIcon,
    Group,
    createStyles,
} from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useMantineTheme, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { UserButton } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";


function aspectRatio2Size(height: number, width: number, aspectRatio: string): { height: number, width: number } {
    if (!aspectRatio) {
        throw new Error('Aspect ratio must be supplied');
    }

    const aspectRatioMatch = aspectRatio.match(/^(\d+):(\d+)$/);

    if (!aspectRatioMatch) {
        throw new Error('Aspect ratio must be in the format "width:height"');
    }

    const aspectRatioWidth = Number(aspectRatioMatch[1]);
    const aspectRatioHeight = Number(aspectRatioMatch[2]);
    const currentAspectRatio = width / height;

    if (currentAspectRatio > aspectRatioWidth / aspectRatioHeight) {
        // Image is wider than desired aspect ratio, so we need to reduce the width
        return {
            width: Math.round(height * aspectRatioWidth / aspectRatioHeight),
            height,
        };
    } else {
        // Image is taller than desired aspect ratio, so we need to reduce the height
        return {
            width,
            height: Math.round(width * aspectRatioHeight / aspectRatioWidth),
        };
    }
}

export default function Generate(props: Partial<DropzoneProps>) {
    const hello = api.example.hello.useQuery({ text: "from tRPC" });
    const [widthSliderValue, setWidthSliderValue] = useState<number>(512);
    const [heightSliderValue, setHeightSliderValue] = useState<number>(512);
    const [imageCountSlider3Value, setImageCountSliderValue] = useState<number>(768);
    interface Size {
        width: number;
        height: number;
    }

    const handleWidthSliderChange = (value: number) => {
        console.log(`handling width slider value: ${value}`)
        setWidthSliderValue(value);
    };

    const handleHeightSliderChange = (value: number) => {
        console.log(`handling height slider value: ${value}`)
        setHeightSliderValue(value);
    };

    const handleImageCountSliderChange = (value: number) => {
        console.log(`handling image count slider value: ${value}`)
        setImageCountSliderValue(value);
    };

    const handleAspectRatioChange = (size: Size) => {
        console.log(`handling aspect ratio change: ${size.width}, ${size.height}`)
        setWidthSliderValue(size.width);
        setHeightSliderValue(size.height);
    };

    return (
        <>
            <Head>
                <title>Xenfiny - Generate AI Art</title>
                <meta name="description" content="Xenfiny - Generate AI Art." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <UserButton afterSignOutUrl="/" />
                <SignOutButton />
            </header>
            <Container fluid={true} mb="lg">
                <Grid grow p="lg" className="bg-slate-50">
                    <Grid.Col span={4}>
                        <Stack justify="space-between" spacing={4}>
                            <Textarea
                                id="prompt"
                                placeholder="Enter prompt here..."
                                label="Prompt"
                                variant="filled"
                                withAsterisk
                            />
                            <Textarea
                                id="positive-prompt"
                                placeholder="Enter negative prompt here..."
                                label="Negative Prompt"
                                variant="filled"
                            />
                            <Text size="xs" mt={20} pt={10} weight={500}>CFG Scale</Text>
                            <Slider
                                id="cfg-scale-slider"
                                defaultValue={7}
                                min={1}
                                max={20}
                                label={(value) => value.toFixed(1)}
                                step={1}
                                labelAlwaysOn
                                onChange={(value) => { console.log(`CFG Scale: ${value}`) }}
                            />
                            <Text size="xs" mt={20} pt={10} weight={500}>Images to Generate</Text>
                            <Slider
                                id="image-count-slider"
                                defaultValue={imageCountSlider3Value}
                                min={1}
                                max={10}
                                label={(value) => value.toFixed(1)}
                                step={1}
                                labelAlwaysOn
                                onChange={(value) => { handleImageCountSliderChange(value); }}
                            />
                            <Text size="xs" mt={20} pt={10} weight={500}>Steps</Text>
                            <Slider
                                id="inference-steps-slider"
                                defaultValue={50}
                                min={10}
                                max={150}
                                label={(value) => value.toFixed(1)}
                                step={1}
                                labelAlwaysOn
                                onChange={(value) => { console.log(`Inference Steps: ${value}`); }}
                            />
                            <Text size="xs" mt={20} pt={10} weight={500}>Height</Text>
                            <Slider
                                id="height-slider"
                                defaultValue={512}
                                value={heightSliderValue}
                                min={384}
                                max={1024}
                                label={(value) => value.toFixed(1)}
                                step={64}
                                labelAlwaysOn
                                onChange={(value) => handleHeightSliderChange(value)}
                            />
                            <Text size="xs" mt={20} pt={10} weight={500}>Width</Text>
                            <Slider
                                id="width-slider"
                                defaultValue={512}
                                value={widthSliderValue}
                                min={384}
                                max={1024}
                                label={(value) => value.toFixed(1)}
                                step={64}
                                labelAlwaysOn
                                onChange={(value) => handleWidthSliderChange(value)}
                            />
                            <Select
                                id="aspect-ratio-select"
                                mt={20}
                                pt={10}
                                label="Aspect Ratio"
                                placeholder="Select aspect ratio..."
                                data={[
                                    { value: '1:1', label: '1:1' },
                                    { value: '2:3', label: '2:3' },
                                    { value: '3:2', label: '3:2' },
                                    { value: '3:4', label: '3:4' },
                                    { value: '4:3', label: '4:3' },
                                    { value: '9:16', label: '9:16' },
                                    { value: '16:9', label: '16:9' },
                                ]}
                                onChange={(value) => handleAspectRatioChange(aspectRatio2Size(heightSliderValue, widthSliderValue, value as string))}
                            />
                            <Select
                                id="sampler-select"
                                mt={20}
                                pt={10}
                                label="Sampler"
                                placeholder="Choose a diffusion sampler method"
                                data={[
                                    { value: 'k_euler', label: 'k_euler' },
                                    { value: 'k_euler_a', label: 'k_euler_a' },
                                    { value: 'ddim', label: 'ddim' },
                                    { value: 'k_heun', label: 'k_heun' },
                                    { value: 'k_dpm_2', label: 'k_dpm_2' },
                                    { value: 'k_lms', label: 'k_lms' },
                                    { value: 'karas', label: 'karas' },
                                ]}
                                onChange={(value) => console.log(value)}
                            />
                            <NumberInput
                                id="random-seed-input"
                                mt={20}
                                pt={10}
                                defaultValue={12789305732983}
                                placeholder="Random seed"
                                label="Random Seed"
                                variant="filled"
                                radius="md"
                                hideControls
                                disabled
                            />
                            <Switch
                                pt={10}
                                mt={20}
                                id="public-switch"
                                defaultChecked
                                label="Public?"
                            />
                            <Dropzone
                                onDrop={(files) => console.log('accepted files', files)}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={3 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                {...props}
                            >
                                <Group position="center" spacing="xl" style={{ minHeight: rem(220), pointerEvents: 'none' }}>
                                    <Dropzone.Accept>
                                        <IconUpload
                                            size="3.2rem"
                                            stroke={1.5}
                                        // color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            size="3.2rem"
                                            stroke={1.5}
                                        // color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconPhoto size="3.2rem" stroke={1.5} />
                                    </Dropzone.Idle>

                                    <div>
                                        <Text size="xl" inline>
                                            Drag images here or click to select files
                                        </Text>
                                        <Text size="sm" color="dimmed" inline mt={7}>
                                            Attach as many files as you like, each file should not exceed 5mb
                                        </Text>
                                    </div>
                                </Group>
                            </Dropzone>
                            <Button size="lg" mt={20} pt={10} radius="md">
                                Generate
                            </Button>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>

                    </Grid.Col>
                    <Grid.Col span={4}>

                    </Grid.Col>
                </Grid>
                <p className="text-2xl text-white">
                    {hello.data ? hello.data.greeting : "Loading tRPC query..."}
                </p>
            </Container>
        </>
    );
}
